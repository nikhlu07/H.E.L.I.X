import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    setIsVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const typeStyles = {
    success: {
      Icon: CheckCircle,
      color: 'text-green-500',
      title: 'Success',
    },
    warning: {
      Icon: AlertTriangle,
      color: 'text-yellow-500',
      title: 'Warning',
    },
    error: {
      Icon: XCircle,
      color: 'text-red-500',
      title: 'Error',
    },
  };

  const { Icon, color, title } = typeStyles[type];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // allow for fade-out animation
  };

  return (
    <div
      className={`w-full max-w-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="bg-white backdrop-blur-sm border border-neutral-200/80 rounded-2xl shadow-lg">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-semibold text-gray-900">{title}</p>
              <p className="mt-1 text-sm text-gray-700">{message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'warning' | 'error') => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error';
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [ { id, message, type }, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
