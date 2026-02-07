import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle size={20} className="text-green-600" />,
  error: <AlertCircle size={20} className="text-red-600" />,
  info: <Info size={20} className="text-blue-600" />,
};

const Toast = ({ show, message = '', onClose, duration = 3500, type = 'success' }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  const bg = type === 'success' ? 'bg-white border-l-4 border-green-500' : type === 'error' ? 'bg-white border-l-4 border-red-500' : 'bg-white border-l-4 border-blue-500';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`${bg} shadow-xl rounded-xl p-4 max-w-sm flex items-start gap-3`} role="status" aria-live="polite">
        <div className="mt-1">{ICONS[type] || ICONS.info}</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-800">{message}</div>
        </div>
        <button aria-label="close toast" onClick={() => onClose && onClose()} className="text-gray-400 hover:text-gray-700 ml-2">
          <X />
        </button>
      </div>
    </div>
  );
};

export default Toast;
