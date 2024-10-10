'use client';
import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';
import EmojiPicker from 'emoji-picker-react';

interface SendBoxProps {
  onSend: (message: { id: string, type: 'text' | 'image' | 'audio', content: string }) => void;
}

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
export const SendBox: React.FC<SendBoxProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const springProps = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(20px)' },
  });

  const debouncedSetText = useCallback(
    debounce((value: string) => {
      setText(value);
    }, 10),
    []
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    debouncedSetText(e.target.value);
  };

  const handleSend = async () => {
    if (text.trim()) {
      onSend({ id: uuidv4(), type: 'text', content: text });
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSend({ id: uuidv4(), type: 'image', content: event.target.result as string });
        }
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <animated.div style={springProps} className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-min-1/4">
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full p-2 mb-2 border rounded-md resize-none dark:bg-gray-700 dark:text-white"
        rows={3}
      />
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mr-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            📷
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="mr-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2">
            <EmojiPicker onEmojiClick={(emojiObject) => {
              setText((prevText) => prevText + emojiObject.emoji);
              setShowEmojiPicker(false);
            }} />
          </div>
        )}
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </animated.div>
  );
};

export default SendBox;
