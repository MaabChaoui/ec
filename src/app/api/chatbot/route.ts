// app/api/chatbot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create context for agricultural assistant
    const systemPrompt = `You are AgriGPT, an expert agricultural AI assistant. You specialize in:
- Plant diseases and pest identification
- Crop management and cultivation techniques
- Soil health and fertilization
- Irrigation and watering schedules
- Organic farming practices
- Plant nutrition and deficiencies
- Seasonal planting guides
- Harvesting and post-harvest handling

Provide helpful, practical advice for farmers and gardeners. Keep responses concise but informative. Use emojis occasionally to make responses friendly. When suggesting treatments, always mention both organic and conventional options when applicable.

Current conversation context:`;

    // Build conversation history for context
    let conversationHistory = systemPrompt;
    if (history && history.length > 0) {
      conversationHistory += "\n\nPrevious conversation:\n";
      history.slice(-6).forEach((msg: any) => {
        conversationHistory += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
    }

    // Add current message
    const fullPrompt = `${conversationHistory}\n\nUser: ${message}\n\nAssistant:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
