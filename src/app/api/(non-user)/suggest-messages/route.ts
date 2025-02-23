import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { exclude } = await req.json();

    console.log("Excluding:", exclude);

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string.
    Each question should be separated by '||'. The questions are for an anonymous social messaging platform,
    and should be suitable for a diverse audience. Avoid personal or sensitive topics.
    Ensure the questions are intriguing and foster curiosity.
    DO NOT INCLUDE any of the following questions: ${exclude || "None"}.
     Each question MUST be at most 100 characters long.`;

    const { textStream } = await streamText({
      model: google("gemini-1.5-flash-8b-latest"),
      prompt: prompt,
      maxRetries: 3,
    });

    if (!textStream) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to generate questions. Please try again.",
        },
        { status: 500 }
      );
    }

    let result = "";
    for await (const delta of textStream) {
      result += delta;
    }

    return NextResponse.json(
      {
        success: true,
        message: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("An Unexpected Error Occurred", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
