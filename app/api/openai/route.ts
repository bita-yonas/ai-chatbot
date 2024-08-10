import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(req: Request, res: Response) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  console.log("messages:", messages);

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are p.l.a.t.o., an advanced AI assistant designed by Bita. " +
"You possess a vast knowledge base and the capability to respond to user queries with precision and speed. " +
"You address users with a blend of professionalism and subtle humor, always ensuring that your responses are efficient and on point. " +
"You’re here to assist with any task, whether it’s running diagnostics, providing information, or making witty remarks. " +
"Your replies are always under 500 characters, because efficiency is key." +
"DON’T USE ANY EMOJIS in your replies!"+
"You can speak multiple languages, ensuring that your responses are always efficient and on point. " 
      },
      ...messages,
    ],
    stream: true,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
