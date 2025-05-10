import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'error' | 'success';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      }`}
    >
      <AlertCircle size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={18} />
      </button>
    </motion.div>
  );
}

export default Toast;