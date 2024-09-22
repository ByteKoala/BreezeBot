'use server';
import { generateText,CoreMessage } from 'ai';
import { google,createGoogleGenerativeAI } from '@ai-sdk/google';
import {  createStreamableValue} from 'ai/rsc';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest"' })
export async function streamingChat(messages: CoreMessage[]) {
  const streamableResponse = createStreamableValue();
  const google1 = createGoogleGenerativeAI({
    // custom settings
    apiKey:''
  });
  const {text } = await generateText({
    model: google1('gemini-1.5-pro',{
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_LOW_AND_ABOVE' },
      ],
    }
    ),  
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  let fullResponse = '';

  for await (const chunk of text) {
    fullResponse += chunk;
    await streamableResponse.update(fullResponse); 
  }

  await streamableResponse.done();

  return streamableResponse.value;
  return text;
}










