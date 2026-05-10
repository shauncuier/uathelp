export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Mock streaming response
    // In production, replace with OpenAI API call:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const stream = await openai.chat.completions.create({ ... stream: true });

    const mockResponse = generateMockResponse(message);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const char of mockResponse) {
          controller.enqueue(encoder.encode(char));
          await new Promise((r) => setTimeout(r, 10));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateMockResponse(message: string): string {
  const q = message.toLowerCase();
  if (q.includes("buet")) {
    return "BUET (Bangladesh University of Engineering and Technology) is the premier engineering institution in Bangladesh. Admission requires GPA 5.00 in both SSC and HSC with A+ in Physics, Chemistry, and Math. The admission test is held in October-November and covers Physics, Chemistry, and Mathematics.";
  }
  if (q.includes("dhaka") || q.includes("du")) {
    return "University of Dhaka is the oldest and most prestigious university in Bangladesh, established in 1921. It offers admission through unit-based tests. Minimum GPA requirements vary by unit, typically 4.00+ in both SSC and HSC.";
  }
  return `Thank you for your question about "${message.slice(0, 50)}". I can help you with university admissions in Bangladesh. Please ask about specific universities, programs, or admission requirements for detailed guidance.`;
}
