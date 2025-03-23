import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { setOnlineStatus, updateMessageStatus, addMessage } from '../redux/chatSlice';
import type { Message } from '../types/type';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5173';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Socket event handlers
socket.on('connect', () => {
  store.dispatch(setOnlineStatus(true));
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  store.dispatch(setOnlineStatus(false));
  console.log('Disconnected from WebSocket server');
});

socket.on('message_delivered', (messageId: string) => {
  store.dispatch(updateMessageStatus({ id: messageId, status: 'delivered' }));
});

socket.on('message_read', (messageId: string) => {
  store.dispatch(updateMessageStatus({ id: messageId, status: 'read' }));
});

socket.on('new_message', (message: Message) => {
  store.dispatch(addMessage(message));
});

socket.on('user_typing', (userId: string) => {
  // Update UI to show typing indicator for specific user
  console.log(`User ${userId} is typing...`);
});

// Helper functions for emitting events
export const socketEmit = {
  sendMessage: (message: Message) => {
    socket.emit('send_message', message);
  },
  
  startTyping: () => {
    socket.emit('typing_start', store.getState().chat.user.id);
  },
  
  stopTyping: () => {
    socket.emit('typing_stop', store.getState().chat.user.id);
  },
  
  markAsRead: (messageId: string) => {
    socket.emit('mark_read', messageId);
  }
};