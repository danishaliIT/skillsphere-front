// Global Theme Configuration
// Pura app is theme use karega consistency ke liye

export const THEME = {
  // PRIMARY COLORS - SkillSphere Brand
  primary: {
    main: '#2563EB',      // Blue 600
    dark: '#1E40AF',      // Blue 800
    light: '#DBEAFE',     // Blue 100
    lighter: '#EFF6FF',   // Blue 50
  },

  // SECONDARY COLORS
  secondary: {
    success: '#10B981',   // Emerald 500
    warning: '#F59E0B',   // Amber 500
    danger: '#EF4444',    // Red 500
    info: '#06B6D4',      // Cyan 500
  },

  // NEUTRAL COLORS
  neutral: {
    50: '#FAFAFA',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // DARK THEME COLORS (Navy Blue)
  dark: {
    bg: '#0F172A',        // Slate 900
    bgSecondary: '#1E293B', // Slate 800
    text: '#FFFFFF',
    textSecondary: '#CBD5E1', // Slate 300
    border: '#334155',    // Slate 700
  },

  // GRADIENTS
  gradients: {
    primary: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
    dark: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  },

  // SHADOWS
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    glow: '0 0 20px rgba(37, 99, 235, 0.3)',
  },

  // SPACING
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // BORDER RADIUS
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '3rem',
    full: '9999px',
  },

  // TYPOGRAPHY
  typography: {
    fontFamily: {
      sans: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
  },

  // RESPONSIVE BREAKPOINTS
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ANIMATION DURATIONS
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
};

// Utility function - Get contrasting text color
export const getTextColor = (bgColor) => {
  const rgb = bgColor.match(/\d+/g);
  if (!rgb) return '#000000';
  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  return brightness > 155 ? '#000000' : '#FFFFFF';
};

// Status Badge Colors
export const STATUS_COLORS = {
  active: { bg: '#DCFCE7', text: '#166534', icon: '🟢' },
  completed: { bg: '#DBEAFE', text: '#1E40AF', icon: '✅' },
  pending: { bg: '#FEF08A', text: '#A16207', icon: '⏳' },
  failed: { bg: '#FEE2E2', text: '#991B1B', icon: '❌' },
  processing: { bg: '#F3E8FF', text: '#6B21A8', icon: '⚙️' },
};

export default THEME;
