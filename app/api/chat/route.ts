import { mistral } from '@ai-sdk/mistral';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: mistral('mistral-large-latest'),
      system: `You are an expert AI university admission assistant for Bangladeshi students. 
You are integrated into "UAT Help". Your goal is to provide accurate, concise, and helpful answers about university admissions, deadlines, GPAs, exams, and scholarships in Bangladesh. 
Keep your answers brief and well-formatted. Do not use extremely long paragraphs. 
Whenever possible, highlight key information like dates and GPAs in bold.`,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
