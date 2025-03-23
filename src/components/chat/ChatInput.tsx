import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, AlertCircle, BookOpen, Calculator, FlaskRound as Flask, Book, X } from 'lucide-react';
import { addMessage, setAiTyping } from '../../redux/chatSlice';
import { getGeminiResponse } from '../../lib/gemini';
import { socketEmit } from '../../lib/socket';
import VoiceRecorder from './VoiceRecorder';
import type { RootState } from '../../redux/store';
import { Message } from '../../types/type'; 

// Define a simple emoji list (no need for external packages)
const EMOJI_CATEGORIES = [
  {
    category: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘"]
  },
  {
    category: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👋", "🤚", "🖐️", "✋", "🖖"]
  },
  {
    category: "Animals",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🦄"]
  },
  {
    category: "Food",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🍕"]
  },
  {
    category: "Objects",
    emojis: ["⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "📷", "📸", "📔", "📕", "📙", "📚", "📖", "🔍", "🔒"]
  },
  {
    category: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️"]
  }
];

const MAX_CHARS = 500;
const SUBJECTS = [
  { id: 'math', icon: Calculator, label: 'Mathematics' },
  { id: 'science', icon: Flask, label: 'Science' },
  { id: 'literature', icon: Book, label: 'Literature' },
  { id: 'general', icon: BookOpen, label: 'General' }
];

let typingTimeout: NodeJS.Timeout;

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [_, setShowMentions] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('general');
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  
  const dispatch = useDispatch();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  
  const { isOnline} = useSelector((state: RootState) => state.chat);
  const theme = useSelector((state: RootState) => state.chat.theme || 'light');

  // Handle clicks outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker && 
        emojiButtonRef.current && 
        emojiPickerRef.current &&
        !emojiButtonRef.current.contains(event.target as Node) &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      socketEmit.stopTyping();
    };
  }, [showEmojiPicker]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleTyping = () => {
    socketEmit.startTyping();
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(() => {
      socketEmit.stopTyping();
    }, 1000);
  };

  const handleEmojiSelect = (emoji: string) => {
    // Insert emoji at cursor position or at the end
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart || 0;
      const newMessage = message.slice(0, cursorPos) + emoji + message.slice(cursorPos);
      setMessage(newMessage);
      
      // Set focus back to textarea and place cursor after the emoji
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newCursorPos = cursorPos + emoji.length;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    } else {
      setMessage(message + emoji);
    }
    
    // Keep emoji picker open for multiple selections
    // setShowEmojiPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isOnline) return;

    setError(null);
    const mentions = message.match(/@(\w+)/g)?.map(m => m.slice(1)) || [];

    const userMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user' as const,
      timestamp: Date.now(),
      status: 'sent' as const,
      mentions,
      subject: selectedSubject,
      type: message.endsWith('?') ? 'question' : undefined
    };

    dispatch(addMessage(userMessage as Message));
    socketEmit.sendMessage(userMessage as Message);
    setMessage('');

    // Get AI response using Gemini
    dispatch(setAiTyping(true));
    try {
      const aiResponse = await getGeminiResponse(message, selectedSubject);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai' as const,
        timestamp: Date.now(),
        status: 'delivered' as const,
        subject: selectedSubject,
        type: 'explanation'
      };
      dispatch(addMessage(aiMessage as Message));
      socketEmit.sendMessage(aiMessage as Message);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setError('API key not configured. Please add a valid Gemini API key to the .env file.');
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble generating a response right now. Please check if the API key is properly configured.",
        sender: 'ai' as const,
        timestamp: Date.now(),
        status: 'delivered' as const,
        subject: selectedSubject,
        type: 'explanation'
      };
      dispatch(addMessage(errorMessage as Message));
    } finally {
      dispatch(setAiTyping(false));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '@') {
      setShowMentions(true);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowMentions(false);
      setShowEmojiPicker(false);
    }
  };

  return (
    <motion.form
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t dark:border-gray-700 p-4 bg-gradient-to-b  from-purple-500 to-purple-400 dark:from-violet-950 dark:to-gray-900 dark:bg-gray-800"
      onSubmit={handleSubmit}
    >
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-500 mb-2"
          >
            <AlertCircle size={16} />
            <span className="text-sm">You're offline. Messages will be sent when you're back online.</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-red-500 mb-2"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {SUBJECTS.map(({ id, icon: Icon, label }) => (
          <motion.button
            key={id}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedSubject(id)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              selectedSubject === id
                ? 'bg-violet-500 text-white'
                : 'bg-violet-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Icon size={16} />
            {label}
          </motion.button>
        ))}
      </div>

      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Ask a question about ${selectedSubject}... Use @ to mention users`}
            className="w-full resize-none rounded-lg border dark:border-gray-600 p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:bg-gray-700 dark:text-white min-h-[40px] max-h-[150px] overflow-y-auto"
            rows={1}
            maxLength={MAX_CHARS}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-2 bottom-2 text-xs text-gray-400 dark:text-gray-500"
          >
            {message.length}/{MAX_CHARS}
          </motion.div>
        </div>
        <VoiceRecorder />
        <motion.button
          ref={emojiButtonRef}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative"
        >
          <Smile size={24} className={showEmojiPicker ? "text-blue-500" : ""} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!message.trim() || !isOnline}
          className="p-2 bg-violet-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={24} />
        </motion.button>
      </div>

      {/* Custom Emoji Picker (right-aligned) */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute right-4 bottom-20 z-10"
          style={{ 
            maxWidth: '320px',
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.75rem', 
            overflow: 'hidden' 
          }}
        >
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-purple-300 text-gray-800'} p-2 flex justify-between items-center border-b ${theme === 'dark' ? 'border-gray-700' : 'border-purple-200'}`}>
            <span className="text-sm font-medium">Emojis</span>
            <button 
              onClick={() => setShowEmojiPicker(false)}
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-full hover:bg-opacity-10 hover:bg-gray-500`}
            >
              <X size={16} />
            </button>
          </div>

          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-500'} overflow-hidden`}>
            {/* Category tabs */}
            <div className={`flex overflow-x-auto scrollbar-hide ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-purple-300 border-purple-200'} border-b`}>
              {EMOJI_CATEGORIES.map((category, index) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(index)}
                  className={`px-3 py-2 text-sm whitespace-nowrap ${
                    selectedCategory === index 
                      ? `${theme === 'dark' ? 'border-voilet-500 text-blue-500' : 'border-violet-500 text-blue-600'} border-b-2` 
                      : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>

            {/* Emoji grid */}
            <div 
              className={`grid grid-cols-8 gap-1 p-3 max-h-[200px] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-purple-200'}`}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: theme === 'dark' ? '#4B5563 #1F2937' : '#CBD5E0 #F9FAFB'
              }}
            >
              {EMOJI_CATEGORIES[selectedCategory].emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`p-1 text-xl rounded hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} transition-colors flex items-center justify-center h-8 w-8`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.form>
  );
};

export default ChatInput;