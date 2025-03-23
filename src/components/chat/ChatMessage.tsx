import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Check, CheckCheck, Play, Pause, BookOpen, Calculator, FlaskRound as Flask, Book } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import type { Message } from '../../types/type';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

const subjectIcons = {
  math: Calculator,
  science: Flask,
  literature: Book,
  general: BookOpen
};

const statusIcons = {
  sent: <Check size={16} />,
  delivered: <CheckCheck size={16} />,
  read: <CheckCheck size={16} className="text-blue-500" />
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isUser = message.sender === 'user';
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    if (message.voiceUrl && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isUser ? '#fff' : '#4B5563',
        progressColor: isUser ? '#E5E7EB' : '#1F2937',
        cursorColor: 'transparent',
        height: 40,
        normalize: true
      });

      wavesurfer.load(message.voiceUrl);
      wavesurferRef.current = wavesurfer;

      wavesurfer.on('finish', () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurfer) {
          wavesurfer.pause();
          try {
            wavesurfer.destroy();
          } catch (error) {
            console.warn('Error destroying WaveSurfer instance:', error);
          }
        }
      };
    }
  }, [message.voiceUrl, isUser]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const SubjectIcon = message.subject ? subjectIcons[message.subject as keyof typeof subjectIcons] : null;

  const renderContent = () => {
    if (message.voiceUrl) {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlay}
            className={`p-2 rounded-full ${
              isUser ? 'bg-violet-500' : 'bg-gray-700'
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div ref={waveformRef} className="flex-1" />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {SubjectIcon && (
          <div className="flex items-center gap-2 text-sm opacity-75">
            <SubjectIcon size={16} />
            <span className="capitalize">{message.subject}</span>
            {message.type && (
              <span className="px-2 py-0.5 bg-opacity-20 rounded-full text-xs">
                {message.type}
              </span>
            )}
          </div>
        )}
        <p className="text-sm whitespace-pre-wrap">
          {message.content.split(' ').map((word, index) => {
            if (word.startsWith('@')) {
              const username = word.slice(1);
              return (
                <span
                  key={index}
                  className="text-blue-300 dark:text-blue-400 font-medium"
                >
                  {word}{' '}
                </span>
              );
            }
            return word + ' ';
          })}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <motion.div
        layout
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-purple-500 dark:bg-gray-700 text-white dark:text-white rounded-bl-none'
        }`}
      >
        {renderContent()}
        <div className="flex items-center justify-end mt-1 space-x-1">
          <motion.span 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.75 }}
            className="text-xs"
          >
            {format(message.timestamp, 'HH:mm')}
          </motion.span>
          {isUser && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="opacity-75"
            >
              {statusIcons[message.status]}
            </motion.span>
          )}
          {message.isEdited && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              className="text-xs"
            >
              (edited)
            </motion.span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;