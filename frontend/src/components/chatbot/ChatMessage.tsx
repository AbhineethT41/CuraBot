import React, { useEffect, useContext } from 'react';
import { User, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { VoiceContext } from '../../pages/ChatbotPage';
import { ChatMessage as ChatMessageType } from '../../store/chatStore';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { isVoiceEnabled } = useContext(VoiceContext);
  
  // Speak the bot message if voice is enabled
  useEffect(() => {
    if (message.role === 'bot' && isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
    
    return () => {
      if (message.role === 'bot' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message, isVoiceEnabled]);
  
  const isUser = message.role === 'user';
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-100 ml-2' : 'bg-gray-100 mr-2'}`}>
          {isUser ? (
            <User size={16} className="text-blue-600" />
          ) : (
            <Bot size={16} className="text-gray-600" />
          )}
        </div>
        
        <div className={`
          py-2 px-3 rounded-lg
          ${isUser 
            ? 'bg-blue-500 text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'}
        `}>
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;