import { mistral } from '@ai-sdk/mistral';
import { createUIMessageStream, createUIMessageStreamResponse, convertToModelMessages, streamText, type UIMessage } from 'ai';
import { universities } from '@/config/universities';

export const maxDuration = 30;

function getLatestUserText(messages: UIMessage[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role !== 'user') continue;
    return message.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join(' ')
      .trim();
  }

  return '';
}

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
  const { messages }: { messages: UIMessage[] } = await req.json();

  try {
    const result = streamText({
      model: mistral('mistral-large-latest'),
      system: `You are an expert AI university admission assistant for Bangladeshi students. 
You are integrated into "UAT Help". Your goal is to provide accurate, concise, and helpful answers about university admissions, deadlines, GPAs, exams, and scholarships in Bangladesh. 
Keep your answers brief and well-formatted. Do not use extremely long paragraphs. 
Whenever possible, highlight key information like dates and GPAs in bold.`,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const statusCode = typeof error === 'object' && error && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode)
      : undefined;

    if (statusCode === 401) {
      console.warn('Mistral unauthorized; serving local fallback response.');
      const fallbackReply = buildFallbackReply(messages);

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
