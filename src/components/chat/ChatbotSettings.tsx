// src/components/chat/ChatbotSettings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export const ChatbotSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    tone: 'friendly',
    expertise: 'general',
    responseLength: 'concise'
  });

  const handleSettingChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      [key]: value
    });
    
    // You can dispatch other actions here if needed
    // For example, to update a different part of your state
    // dispatch(someOtherAction({ [key]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-purple-500 dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings size={20} />
        <h2 className="text-lg font-semibold">Chatbot Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tone</label>
          <select
            value={settings.tone}
            onChange={(e) => handleSettingChange('tone', e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expertise</label>
          <select
            value={settings.expertise}
            onChange={(e) => handleSettingChange('expertise', e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="general">General</option>
            <option value="math">Mathematics</option>
            <option value="science">Science</option>
            <option value="literature">Literature</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Response Length</label>
          <select
            value={settings.responseLength}
            onChange={(e) => handleSettingChange('responseLength', e.target.value)}
            className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotSettings;