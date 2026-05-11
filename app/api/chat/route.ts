import { mistral } from '@ai-sdk/mistral';
import { createUIMessageStream, createUIMessageStreamResponse, convertToModelMessages, streamText, type UIMessage } from 'ai';
import { universities } from '@/config/universities';
import { extractAssistantText, getCachedAnswer, getLatestUserText, saveCachedAnswer } from '@/lib/chat-cache';
import { saveConversationTurn } from '@/lib/chat-history';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';

export const maxDuration = 30;

function buildFallbackReply(messages: UIMessage[]) {
  const query = getLatestUserText(messages).toLowerCase();

  if (!query) {
    return 'Ask me about university deadlines, GPA requirements, admission tests, or compare Bangladeshi universities.';
  }

  const matchedUniversity = universities.find(
    (uni) =>
      query.includes(uni.slug.replaceAll('-', ' ')) ||
      query.includes(uni.name.toLowerCase()) ||
      query.includes(uni.slug.toLowerCase())
  );

  if (matchedUniversity) {
    return [
      `**${matchedUniversity.name}**`,
      `Type: ${matchedUniversity.type}`,
      `Location: ${matchedUniversity.location}`,
      `Min GPA: ${matchedUniversity.minGpa.toFixed(2)}`,
      `Deadline: ${matchedUniversity.admissionDeadline ?? 'Not listed'}`,
      matchedUniversity.examDate ? `Exam date: ${matchedUniversity.examDate}` : null,
      `Programs: ${matchedUniversity.programs.join(', ')}`,
    ]
      .filter(Boolean)
      .join('\n');
  }

  if (query.includes('public university') || query.includes('top universities')) {
    const featuredPublic = universities
      .filter((uni) => uni.type === 'public')
      .sort((a, b) => (a.ranking ?? 999) - (b.ranking ?? 999))
      .slice(0, 5)
      .map((uni) => `- ${uni.name} (${uni.location}) — GPA ${uni.minGpa.toFixed(2)}, deadline ${uni.admissionDeadline}`)
      .join('\n');

    return `Top public options:\n${featuredPublic}`;
  }

  if (query.includes('scholarship')) {
    return 'Many private universities offer merit-based scholarships, and some public universities provide waivers or financial aid. Share a specific university if you want a tighter answer.';
  }

  if (query.includes('gpa') || query.includes('eligibility') || query.includes('admission')) {
    return 'Most Bangladeshi universities require SSC/HSC GPAs between 3.5 and 5.0 depending on the institution. Tell me a university name and I can give the exact requirement.';
  }

  return 'I can help with university deadlines, GPA requirements, admission tests, and program comparisons. Ask about a specific university or type of university.';
}

export async function POST(req: Request) {
  const { conversationId, messages, timestamp }: { conversationId?: string; messages: UIMessage[]; timestamp?: string } = await req.json();
  const latestQuestion = getLatestUserText(messages);
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  const now = new Date(timestamp || new Date());
  const currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (!latestQuestion) {
    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        originalMessages: messages,
        execute({ writer }) {
          const reply = 'Ask me about university deadlines, GPA requirements, admission tests, or compare Bangladeshi universities.';
          writer.write({ type: 'text-start', id: 'fallback-response' });
          writer.write({ type: 'text-delta', id: 'fallback-response', delta: reply });
          writer.write({ type: 'text-end', id: 'fallback-response' });
        },
      }),
    });
  }

  let cachedAnswer = null;
  try {
    cachedAnswer = await getCachedAnswer(latestQuestion);
  } catch (cacheError) {
    console.warn("Chat cache lookup failed; continuing without cache.", cacheError);
  }
  if (cachedAnswer) {
    if (conversationId && userId) {
      try {
        await saveConversationTurn({
          conversationId,
          userId,
          question: latestQuestion,
          response: cachedAnswer.answer_markdown,
          model: cachedAnswer.model,
        });
      } catch (cacheError) {
        console.warn("Conversation save failed; continuing without history.", cacheError);
      }
    }

    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        originalMessages: messages,
        execute({ writer }) {
          writer.write({ type: 'text-start', id: 'cached-response' });
          writer.write({ type: 'text-delta', id: 'cached-response', delta: cachedAnswer.answer_markdown });
          writer.write({ type: 'text-end', id: 'cached-response' });
        },
      }),
    });
  }

  try {
    const result = streamText({
      model: mistral('mistral-large-latest'),
      system: `You are an expert AI university admission assistant for Bangladeshi students. 
You are integrated into "UAT Help". Your goal is to provide accurate, concise, and helpful answers about university admissions, deadlines, GPAs, exams, and scholarships in Bangladesh. 
Keep your answers brief and well-formatted. Do not use extremely long paragraphs. 
Whenever possible, highlight key information like dates and GPAs in bold.

**Current Date and Time:** ${currentDate}, ${currentTime} (Bangladesh Time - IST)
Use this information to provide up-to-date responses. When discussing deadlines, admission cycles, or time-sensitive information, always reference the current date to ensure accuracy.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      onFinish: async ({ responseMessage }) => {
        const answer = extractAssistantText(responseMessage);
        if (answer) {
          try {
            await saveCachedAnswer({
              question: latestQuestion,
              answerMarkdown: answer,
              answerSource: "model",
              model: "mistral-large-latest",
            });
            if (conversationId && userId) {
              await saveConversationTurn({
                conversationId,
                userId,
                question: latestQuestion,
                response: answer,
                model: "mistral-large-latest",
              });
            }
          } catch (cacheError) {
            console.warn("Chat cache save failed; continuing without cache.", cacheError);
          }
        }
      },
    });
  } catch (error) {
    const statusCode = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : undefined;

    if (statusCode === 401) {
      console.warn('Mistral unauthorized; serving local fallback response.');
      const fallbackReply = buildFallbackReply(messages);

      try {
        await saveCachedAnswer({
          question: latestQuestion,
          answerMarkdown: fallbackReply,
          answerSource: "fallback",
          model: null,
        });
        if (conversationId && userId) {
          await saveConversationTurn({
            conversationId,
            userId,
            question: latestQuestion,
            response: fallbackReply,
            model: null,
          });
        }
      } catch (cacheError) {
        console.warn("Chat cache save failed; continuing without cache.", cacheError);
      }

      return createUIMessageStreamResponse({
        stream: createUIMessageStream({
          originalMessages: messages,
          execute({ writer }) {
            writer.write({ type: 'text-start', id: 'fallback-response' });
            writer.write({ type: 'text-delta', id: 'fallback-response', delta: fallbackReply });
            writer.write({ type: 'text-end', id: 'fallback-response' });
          },
        }),
      });
    }

    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
