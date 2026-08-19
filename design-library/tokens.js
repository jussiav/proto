/**
 * AutoVex / Wheelaway Design Tokens
 * Source: AI Dribbles Figma file (V99BoHZwiWopbwzLLorzDN)
 * Version: 1.0 – March 2025
 */

export const colors = {
  brand: {
    sky:       '#DAF0F5',
    turquoise: '#00F0DC',
    blue:      '#0B6DFF',
    darkBlue:  '#08234D',
    peach:     '#F5AB84',
    black:     '#000000',
    white:     '#FFFFFF',
  },

  blue: {
    50:  '#EEF6FA',
    100: '#D7EDFF',
    200: '#B9E0FF',
    300: '#88CFFF',
    400: '#50B2FF',
    500: '#2890FF',
    700: '#0A59EB',
    800: '#0F47BE',
    900: '#134195',
    950: '#11285A',
  },

  error: {
    50:  '#FEF2F2',
    100: '#FEE2E1',
    200: '#FECACA',
    300: '#FDA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2625',
    700: '#B91C1B',
    800: '#991B1B',
    900: '#7F1C1D',
    950: '#450A0A',
  },

  warning: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    950: '#451A03',
  },

  success: {
    50:  '#F7FEE7',
    100: '#ECFCCB',
    200: '#D9F99D',
    300: '#BEF264',
    400: '#A3E635',
    500: '#84CC16',
    600: '#65A30D',
    700: '#4D7C0F',
    800: '#3F6212',
    900: '#365314',
    950: '#1A2E05',
  },

  info: {
    50:  '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
    950: '#082F49',
  },

  slate: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64758B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  orange: {
    50:  '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#412006',
  },
};

export const typography = {
  fonts: {
    headline: "'Barlow', sans-serif",   // Bold only — H1, H2
    body:     "'DM Sans', sans-serif",  // Primary — Regular, Medium, Bold
  },
  weights: {
    light:   300,
    regular: 400,
    medium:  500,
    bold:    700,
  },
  sizes: {
    xxs:  '11px',
    xs:   '12px',
    sm:   '14px',
    base: '16px',
    lg:   '18px',
    xl:   '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
    '8xl': '96px',
    '9xl': '128px',
  },
  lineHeights: {
    xxs:  '15px',
    xs:   '15px',
    sm:   '20px',
    base: '24px',
    lg:   '28px',
    xl:   '28px',
    '2xl': '32px',
    '3xl': '36px',
    '4xl': '40px',
    // 5xl–9xl: 'normal'
  },
};

export const borderRadius = {
  none: '0px',
  sm:   '2px',
  DEFAULT: '4px',
  md:   '6px',
  lg:   '8px',
  xl:   '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

export const shadows = {
  sm:    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md:    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg:    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl:    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none:  'none',
};

export const components = [
  'button',
  'button-info',       // Button + info variant
  'badge-status',
  'tag-registration',  // tag/registration_number
  'info-element',
  'thumbnail-image',   // 48px / 64px / 80px sizes
  'progress-bar',
  'input-field',
  'input-field-text',  // input-field/text/default
  'text-area',
  'dropdown',
  'radio',
  'radio-button',
  'checkbox-description',
  'checkbox-button',
  'toggle',
  'slider',
];
