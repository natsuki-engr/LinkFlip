// Theme colors based on DESIGN_SYSTEM.md
export const Colors = {
  // Primary gradient colors
  primary: {
    orange: '#FF9A56',
    gold: '#FFB347',
    light: '#FFC966',
    deep: '#FF8C42',
  },

  // Light mode colors
  light: {
    background: '#FAFAF8',
    backgroundGradient: ['#FFF9F5', '#FFECDB'],
    glass80: 'rgba(255, 255, 255, 0.8)',
    glass60: 'rgba(255, 255, 255, 0.6)',
    glass40: 'rgba(255, 255, 255, 0.4)',
    text: '#1A1410',
    textSecondary: '#6B6158',
    border: 'rgba(0, 0, 0, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    qrBackground: ['rgba(255, 255, 255, 0.95)', 'rgba(255, 248, 240, 0.95)'],
  },

  // Dark mode colors
  dark: {
    background: '#0F0E0C',
    backgroundGradient: ['#1A1410', '#2D2420'],
    glass80: 'rgba(30, 28, 24, 0.8)',
    glass60: 'rgba(30, 28, 24, 0.6)',
    glass40: 'rgba(30, 28, 24, 0.4)',
    text: '#F5F3F0',
    textSecondary: '#A89A8F',
    border: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    qrBackground: ['rgba(30, 28, 24, 0.95)', 'rgba(45, 36, 32, 0.95)'],
  },

  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
} as const;

// Typography sizes
export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  section: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  card: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 21,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 17,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
  },
} as const;

// Spacing values
export const Spacing = {
  screen: 16,
  section: 24,
  element: 12,
  gutter: 16,
} as const;

// Border radius values
export const BorderRadius = {
  card: 16,
  button: 12,
  input: 12,
  modal: 20,
} as const;

// Shadow styles
export const Shadows = {
  elevation1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  elevation2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  elevation3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  glassDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

// Animation timings
export const Animations = {
  flip: {
    duration: 200,
  },
  press: {
    duration: 150,
    scale: 0.95,
    opacity: 0.8,
  },
  button: {
    duration: 100,
    scale: 0.97,
  },
} as const;

// Card dimensions
export const CardDimensions = {
  width: 160,
  height: 140,
  iconSize: 48,
  qrSize: 120,
} as const;
