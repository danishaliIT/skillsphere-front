// Reusable UI Components Library
import React from 'react';
import { Camera, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import THEME, { STATUS_COLORS } from '../styles/theme';

// ==================== PROFILE PICTURE COMPONENT ====================
export const ProfilePictureUploader = ({ 
  currentImage, 
  preview, 
  onFileChange, 
  size = 'lg',
  editable = true,
  fallbackInitials = '?'
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  };

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 32,
    xl: 48,
  };

  return (
    <div className="relative inline-block group">
      <div className={`${sizeMap[size]} bg-gradient-to-br from-blue-500 to-blue-700 rounded-[2.5rem] overflow-hidden border-4 border-blue-400/30 flex items-center justify-center text-white shadow-xl`}>
        {preview ? (
          <img src={preview} className="w-full h-full object-cover" alt="Profile" />
        ) : currentImage ? (
          <img src={currentImage} className="w-full h-full object-cover" alt="Profile" />
        ) : (
          <span className={`font-black italic text-${size === 'xl' ? '5xl' : size === 'lg' ? '3xl' : size === 'md' ? '2xl' : 'lg'}`}>
            {fallbackInitials}
          </span>
        )}
      </div>

      {editable && (
        <label className="absolute -bottom-4 -right-4 size-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer group-hover:bg-blue-700 border-4 border-white">
          <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          <Camera size={iconSizeMap[size]} />
        </label>
      )}
    </div>
  );
};

// ==================== BUTTON COMPONENT ====================
export const Button = ({
  children,
  variant = 'primary', // primary, secondary, danger, ghost, outline
  size = 'md', // sm, md, lg
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClass = 'font-black italic uppercase tracking-widest transition-all rounded-full inline-flex items-center justify-center gap-2 focus:outline-none';

  const variantMap = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20`,
    secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:opacity-50`,
    danger: `bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-500/20`,
    success: `bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-500/20`,
    ghost: `text-blue-600 hover:bg-blue-50 disabled:opacity-50`,
    outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50`,
  };

  const sizeMap = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-10 py-4 text-base',
  };

  return (
    <button
      className={`${baseClass} ${variantMap[variant]} ${sizeMap[size]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : null}
      {children}
    </button>
  );
};

// ==================== CARD COMPONENT ====================
export const Card = ({ 
  children, 
  variant = 'light', // light, dark, elevated
  className = '',
  ...props 
}) => {
  const variantMap = {
    light: 'bg-white border border-gray-100 shadow-sm',
    dark: 'bg-blue-900/10 border border-blue-200/30 shadow-sm',
    elevated: 'bg-white border border-gray-50 shadow-xl shadow-gray-200/50',
  };

  return (
    <div className={`rounded-[2rem] p-8 ${variantMap[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

// ==================== FORM INPUT ====================
export const FormInput = ({
  label,
  error,
  required = false,
  type = 'text',
  icon: Icon,
  ...props
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest inline-block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={type}
          className={`w-full ${Icon ? 'pl-14' : 'pl-6'} pr-6 py-4 bg-gray-50 border-2 ${error ? 'border-red-300' : 'border-gray-200'} rounded-2xl font-bold italic focus:border-blue-500 focus:ring-0 transition-all ${error ? 'text-red-600' : 'text-gray-900'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 font-bold italic flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};

// ==================== FORM SELECT ====================
export const FormSelect = ({
  label,
  error,
  required = false,
  options = [],
  ...props
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest inline-block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`w-full px-6 py-4 bg-gray-50 border-2 ${error ? 'border-red-300' : 'border-gray-200'} rounded-2xl font-bold italic focus:border-blue-500 focus:ring-0 transition-all ${error ? 'text-red-600' : 'text-gray-900'}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 font-bold italic flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};

// ==================== TEXTAREA ====================
export const FormTextarea = ({
  label,
  error,
  required = false,
  rows = 4,
  ...props
}) => {
  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest inline-block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-6 py-4 bg-gray-50 border-2 ${error ? 'border-red-300' : 'border-gray-200'} rounded-2xl font-bold italic focus:border-blue-500 focus:ring-0 transition-all resize-none ${error ? 'text-red-600' : 'text-gray-900'}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600 font-bold italic flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </p>
      )}
    </div>
  );
};

// ==================== STATUS BADGE ====================
export const StatusBadge = ({ 
  status, // active, completed, pending, failed, processing
  customColor,
  size = 'md'
}) => {
  const sizeMap = { sm: 'text-xs px-3 py-1', md: 'text-sm px-4 py-2', lg: 'text-base px-6 py-3' };
  const color = customColor || STATUS_COLORS[status] || STATUS_COLORS.pending;

  return (
    <span className={`${sizeMap[size]} rounded-full font-black italic uppercase tracking-widest`} style={{ backgroundColor: color.bg, color: color.text }}>
      {color.icon} {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

// ==================== ALERT MESSAGE ====================
export const Alert = ({
  type = 'info', // success, error, warning, info
  message,
  onClose,
  icon,
}) => {
  const typeMap = {
    success: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    error: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  };

  const styles = typeMap[type];

  return (
    <div className={`p-6 rounded-2xl ${styles.bg} border ${styles.border} flex items-center justify-between gap-4 animate-in slide-in-from-top-4`}>
      <div className={`flex items-center gap-3 ${styles.text}`}>
        {icon || <AlertCircle size={20} />}
        <span className="font-bold italic text-sm">{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className={`${styles.text} hover:opacity-70`}>
          <X size={20} />
        </button>
      )}
    </div>
  );
};

// ==================== LOADING SKELETON ====================
export const Skeleton = ({ width = 'w-full', height = 'h-10', rounded = 'rounded-xl' }) => {
  return <div className={`${width} ${height} ${rounded} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse`} />;
};

// ==================== STATS CARD ====================
export const StatsCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  trendType = 'up', // up, down, neutral
  color = 'blue' // blue, green, red, purple
}) => {
  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600' },
  };

  const trendColorMap = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
          <p className="text-4xl font-black text-gray-900 italic mt-2">{value}</p>
        </div>
        {(() => {
          const c = colorMap[color] || colorMap.blue;
          return (
            <div className={`p-4 rounded-2xl ${c.bg}`}>
              {Icon && <Icon size={24} className={c.icon} />}
            </div>
          );
        })()}
      </div>
      {trend && (
        <p className={`text-sm font-bold italic ${trendColorMap[trendType]}`}>
          {trendType === 'up' ? '📈' : trendType === 'down' ? '📉' : '➡️'} {trend}
        </p>
      )}
    </Card>
  );
};

export default {
  ProfilePictureUploader,
  Button,
  Card,
  FormInput,
  FormSelect,
  FormTextarea,
  StatusBadge,
  Alert,
  Skeleton,
  StatsCard,
};
