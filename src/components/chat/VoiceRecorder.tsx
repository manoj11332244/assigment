import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Mic, Square, Send } from 'lucide-react';
import { addMessage } from '../../redux/chatSlice';
import type { Message } from '../../types/type';

export const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      const voiceUrl = URL.createObjectURL(audioBlob);
      const message: Message = {
        id: Date.now().toString(),
        content: '🎤 Voice message',
        sender: 'user',
        timestamp: Date.now(),
        status: 'sent',
        voiceUrl,
        voiceDuration: 0 // Duration would be calculated from the actual audio
      };

      dispatch(addMessage(message));
      setAudioBlob(null);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-purple-500">
      {!audioBlob ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-2 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={sendVoiceMessage}
          className="p-2 bg-blue-500 text-white rounded-full"
        >
          <Send size={20} />
        </motion.button>
      )}
    </div>
  );
};

export default VoiceRecorder;