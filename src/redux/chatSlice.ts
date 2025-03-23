import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Message,ThemeMode } from '../types/type';

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState: ChatState = {
  messages: [],
  isAiTyping: false,
  theme: getInitialTheme(),
  user: {
    id: '1',
    name: 'Aloha Assistant',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  },
  isOnline: navigator.onLine,
  availableUsers: [
    {
      id: '1',
      name: 'AI Assistant',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      name: 'Math Tutor',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Science Expert',
      status: 'offline',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
    }
  ],
  learningProgress: {
    math: { level: 1, questionsAnswered: 0, accuracy: 0 },
    science: { level: 1, questionsAnswered: 0, accuracy: 0 },
    literature: { level: 1, questionsAnswered: 0, accuracy: 0 }
  }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (action.payload.type === 'question' && action.payload.subject) {
        state.currentSubject = action.payload.subject;
      }
    },
    setAiTyping: (state, action: PayloadAction<boolean>) => {
      state.isAiTyping = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ id: string; status: Message['status'] }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.status = action.payload.status;
      }
    },
    editMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.content = action.payload.content;
        message.isEdited = true;
      }
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    updateLearningProgress: (state, action: PayloadAction<{ subject: string; correct: boolean }>) => {
      const progress = state.learningProgress[action.payload.subject];
      if (progress) {
        progress.questionsAnswered++;
        const totalCorrect = progress.accuracy * (progress.questionsAnswered - 1);
        progress.accuracy = (totalCorrect + (action.payload.correct ? 1 : 0)) / progress.questionsAnswered;
        
        if (progress.questionsAnswered % 5 === 0 && progress.accuracy >= 0.8) {
          progress.level++;
        }
      }
    },
    addVoiceMessage: (state, action: PayloadAction<{ id: string; voiceUrl: string; voiceDuration: number }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.voiceUrl = action.payload.voiceUrl;
        message.voiceDuration = action.payload.voiceDuration;
      }
    }
  }
});

export const { 
  addMessage, 
  setAiTyping, 
  toggleTheme, 
  setTheme,
  updateMessageStatus, 
  editMessage,
  setOnlineStatus,
  updateLearningProgress,
  addVoiceMessage
} = chatSlice.actions;
export default chatSlice.reducer;