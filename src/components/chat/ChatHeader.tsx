import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Moon, Sun, Wifi, WifiOff, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toggleTheme, setOnlineStatus } from '../../redux/chatSlice';
import type { RootState } from '../../redux/store';

export const ChatHeader: React.FC = () => {
  const dispatch = useDispatch();
  const { theme, user, isOnline } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    const handleOnline = () => dispatch(setOnlineStatus(true));
    const handleOffline = () => dispatch(setOnlineStatus(false));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b dark:border-gray-700 p-4 dark:bg-gray-900 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-purple-700 cursor-pointer dark:hover:bg-gray-700 mr-2"
            aria-label="Back to home"
          >
            <ArrowLeft className="text-gray-600 dark:text-gray-300" />
          </motion.button>
        </Link>
        <motion.img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        <div>
          <h2 className="font-semibold dark:text-white">{user.name}</h2>
          <AnimatePresence mode="wait">
            <motion.span
              key={isOnline ? 'online' : 'offline'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`text-sm ${isOnline ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}
            >
              {isOnline ? (
                <>
                  <Wifi size={14} />
                  Online
                </>
              ) : (
                <>
                  <WifiOff size={14} />
                  Offline
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-full hover:bg-purple-700 cursor-pointer dark:hover:bg-gray-700"
      >
        {theme === 'light' ? (
          <Moon className="text-gray-600 dark:text-gray-300" />
        ) : (
          <Sun className="text-gray-600 dark:text-gray-300" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default ChatHeader;