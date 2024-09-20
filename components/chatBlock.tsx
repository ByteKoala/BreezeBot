'use client';
import React, { useState, useEffect, useRef } from 'react';
import { SendBox } from './sendBox';
import { Message } from './message';
import { streamingChat } from '../app/actions';
import { CoreMessage } from 'ai';

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

      const response = await streamingChat(chatMessages);

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
          <Message
            key={msg.id}
            type={msg.type === 'image' ? 'animation' : msg.type}
            content={msg.content}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
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
