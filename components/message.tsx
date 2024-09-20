
import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface MessageProps {
  type: 'text' | 'audio' | 'video' | 'animation';
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export const Message: React.FC<MessageProps> = ({ type, content, sender, timestamp }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const springProps = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
  });

  const expandSpring = useSpring({
    maxHeight: isExpanded ? '1000px' : '100px',
    overflow: 'hidden',
  });

  const renderContent = () => {
    switch (type) {
      case 'text':
        return <p className="text-sm">{content}</p>;
      case 'audio':
        return <audio src={content} controls className="w-full" />;
      case 'video':
        return <video src={content} controls className="w-full" />;
      case 'animation':
        return <img src={content} alt="Animation" className="w-full" />;
      default:
        return null;
    }
  };

  const messageClass = sender === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800';

  return (
    <animated.div style={springProps} className={`mb-4 ${sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
      <div className={`${messageClass} rounded-lg shadow-md p-4 max-w-3/4`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">{sender === 'user' ? 'You' : 'Bot'}</span>
          <span className="text-xs text-gray-500">{timestamp}</span>
        </div>
        <animated.div style={expandSpring} className="overflow-y-auto">
          {renderContent()}
        </animated.div>
        {type === 'text' && content.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 text-sm mt-2"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    </animated.div>
  );
};

export default Message;
