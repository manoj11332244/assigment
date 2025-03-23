import { store } from '../redux/store';

export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: number;
    status: 'sent' | 'delivered' | 'read';
    isEdited?: boolean;
    mentions?: string[];
    voiceUrl?: string;
    voiceDuration?: number;
    type?: 'question' | 'explanation' | 'example' | 'correction';
    subject?: 'math' | 'science' | 'literature' | 'general';
  }
  
  export interface User {
    id: string;
    name: string;
    status: 'active' | 'offline' | 'typing';
    avatar: string;
  }

  
// Theme types
export type ThemeMode = 'light' | 'dark';
  
  export interface ChatState {
    messages: Message[];
    isAiTyping: boolean;
    theme: ThemeMode;
    user: User;
    isOnline: boolean;
    availableUsers: User[];
    currentSubject?: string;
    learningProgress: {
      [subject: string]: {
        level: number;
        questionsAnswered: number;
        accuracy: number;
      };
    };
  }

  // Define RootState type using the store
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;