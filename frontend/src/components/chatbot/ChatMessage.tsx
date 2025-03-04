import React from 'react';
import { User, Bot } from 'lucide-react';
import VoiceOutput from './VoiceOutput';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isUser ? 'ml-3' : 'mr-3'} ${isUser ? 'bg-blue-100' : 'bg-gray-200'}`}>
          {isUser ? <User size={20} className="text-blue-600" /> : <Bot size={20} className="text-gray-600" />}
        </div>
        
        <div className={`rounded-lg px-4 py-2 ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
          <div className="flex justify-between items-start">
            <p className="text-sm">{message.text}</p>
            {!isUser && <VoiceOutput text={message.text} autoPlay={true} />}
          </div>
          <p className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;