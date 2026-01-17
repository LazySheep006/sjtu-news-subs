import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.type) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast.type) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ${
      toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-80">
        <X size={18} />
      </button>
    </div>
  );
};