import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Loom AI, a friendly and knowledgeable crypto community assistant. You help users with:
- Understanding cryptocurrency concepts and terminology
- Discussing market trends (without giving financial advice)
- Explaining blockchain technology
- Community guidelines and platform features
- General crypto culture and memes

Always remind users that you don't provide financial advice. Be engaging, use crypto slang naturally (HODL, WAGMI, etc.), and keep responses concise. You're part of the Loom community platform.`;

export async function POST(request: Request) {
  try {
    const { message, communityContext } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemMessage = communityContext
      ? `${SYSTEM_PROMPT}\n\nYou're currently in the "${communityContext}" community chat.`
      : SYSTEM_PROMPT;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemMessage,
      messages: [{ role: "user", content: message }],
    });

    const textContent = response.content.find((block) => block.type === "text");
    const reply = textContent ? textContent.text : "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Make sure your API key is configured." },
      { status: 503 }
    );
  }
}
