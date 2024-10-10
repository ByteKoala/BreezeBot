import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro";
const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
//const GOOGLE_GENERATIVE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function executeConversation(request: string[]) {
  const genAI = new GoogleGenerativeAI(GOOGLE_GENERATIVE_AI_API_KEY as string);
  const geminimMdel = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };


  const chat = geminimMdel.startChat({ 
    generationConfig,
    history: [
    ],
  });

  const chatResult = await chat.sendMessage(request);
  const aiRes = chatResult.response;
  return aiRes.text();
}

 export default executeConversation; 