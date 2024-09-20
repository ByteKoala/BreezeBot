'use server';
import { streamText,CoreMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import {  createStreamableValue} from 'ai/rsc';

export async function streamingChat(messages: CoreMessage[]) {
  const streamableResponse = createStreamableValue();

  const {textStream } = await streamText({
    model: openai('gpt-4'),  // Changed from 'gpt-3.5-turbo' to 'gpt-4'
    messages,
    temperature: 0.7,
    maxTokens: 1000,
  });

  let fullResponse = '';

  for await (const chunk of textStream) {
    fullResponse += chunk;
    await streamableResponse.update(fullResponse);
  }

  await streamableResponse.done();

  return streamableResponse.value;
}










