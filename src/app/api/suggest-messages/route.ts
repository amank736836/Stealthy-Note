import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing,foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const stream = createStreamableValue("");

    (async () => {
      const { textStream } = streamText({
        model: google("gemini-1.5-flash-8b-latest"),
        prompt: prompt,
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }

      stream.done();
    })();

    return { output: stream.value };
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;

      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        {
          status,
        }
      );
    } else {
      console.error("An Unexpected Error Occurred", error);
    }
  }
}
