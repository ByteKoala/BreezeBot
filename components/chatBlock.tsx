'use client';
import React, { useState, useEffect, useRef } from 'react';
import { SendBox } from './sendBox';
import { Message } from './message';
import { streamingChat } from '../app/actions';
import { CoreMessage } from 'ai';
import executeConversation from "../app/GoogleAction";
import Image from 'next/image';

interface ChatMessage {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const ChatBlock: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (message: { id: string; type: 'text' | 'image' | 'audio'; content: string }) => {
    const newUserMessage: ChatMessage = {
      ...message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      const chatMessages: CoreMessage[] = [
        { role: 'user', content: message.content },
      ];

      //const response=await executeConversation(chatMessages);
      //const response = await streamingChat(chatMessages);/**using Vercel AI SDK */
      const chatContent = chatMessages.map(msg => msg.content.toString());
      const response = await executeConversation(chatContent);
      const newBotMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'text',
        content: await response.toString(),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
      <div className="flex-grow overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.sender === 'user' ? (
              <Image
                src="/user-avatar.png"
                alt="User Avatar"
                width={50}
                height={50}
                className="rounded-full ml-2"
              />
            ) : (
              <Image
                src="/bot-avatar.png"
                alt="Bot Avatar"
                width={40}
                height={40}
                className="rounded-full mr-2"
              />
            )}
            <Message
              type={msg.type === 'image' ? 'animation' : msg.type}   
              content={msg.content}
              sender={msg.sender}
              timestamp={msg.timestamp}
            />
          </div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="animate-pulse">Bot is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <SendBox onSend={handleSend} />
    </div>
  );
};
