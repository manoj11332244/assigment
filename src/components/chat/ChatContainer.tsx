import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import type { RootState } from '../../redux/store';

export const ChatContainer: React.FC = () => {
  const { messages, isAiTyping } = useSelector((state: RootState) => state.chat);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-violet-300 to-violet-200 dark:bg-gradient-to-r dark:from-violet-950 dark:to-gray-900"
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <ChatMessage 
            className={'bg-violet-500'}
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        {isAiTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-300"
          >
            <div className="bg-violet-500 dark:bg-gray-800 rounded-full p-3">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-violet-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-violet-400 rounded-full"
                />
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-2 h-2 bg-gray-500 dark:bg-violet-400 rounded-full"
                />
              </div>
            </div>
            <span className="text-sm">AI is typing...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatContainer;