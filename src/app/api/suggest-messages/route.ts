import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai'
import { NextResponse } from 'next/server';

const genAi = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const model = genAi.languageModel('gemini-1.5-flash');

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Generate response from the gemini-1.5-flash model
    const response = await streamText ({ model,prompt });

    // Return the generated text
    return NextResponse.json({ questions: response.toDataStreamResponse });
  } catch (error: any) {
    if (error.response) {
      // API error handling
      const { status, statusText, data } = error.response;
      return new Response(JSON.stringify({ status, statusText, data }), {
        status,
      });
    } else {
      // General error handling
      console.error('An unexpected error occurred:', error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  }
}
