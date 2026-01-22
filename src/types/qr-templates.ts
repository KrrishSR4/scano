export interface QRTemplate {
  id: string;
  name: string;
  fgColor: string;
  bgColor: string;
  cornerRadius?: number;
  style?: 'squares' | 'dots';
  gradient?: {
    type: 'linear' | 'radial';
    colors: [string, string];
    rotation?: number;
  };
}

export interface TextStyle {
  text: string;
  fontFamily: string;
  color: string;
  fontSize: number;
}

export interface ExportSettings {
  format: 'png' | 'svg' | 'pdf';
  width: number;
  height: number;
}

export interface QRHistoryItem {
  id: string;
  value: string;
  templateId: string;
  textStyle: TextStyle;
  createdAt: number;
}

export const QR_TEMPLATES: QRTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal B&W',
    fgColor: '#1a1a1a',
    bgColor: '#ffffff',
    style: 'squares',
  },
  {
    id: 'rounded',
    name: 'Rounded',
    fgColor: '#2d3436',
    bgColor: '#ffffff',
    cornerRadius: 8,
    style: 'dots',
  },
  {
    id: 'gradient-teal',
    name: 'Teal Gradient',
    fgColor: '#0d9488',
    bgColor: '#ffffff',
    gradient: {
      type: 'linear',
      colors: ['#0d9488', '#06b6d4'],
      rotation: 135,
    },
  },
  {
    id: 'pastel',
    name: 'Soft Pastel',
    fgColor: '#6366f1',
    bgColor: '#faf5ff',
    style: 'dots',
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    fgColor: '#e5e5e5',
    bgColor: '#18181b',
  },
  {
    id: 'light',
    name: 'Light Theme',
    fgColor: '#404040',
    bgColor: '#fafafa',
  },
  {
    id: 'modern-blocks',
    name: 'Modern Blocks',
    fgColor: '#1e293b',
    bgColor: '#f8fafc',
    style: 'squares',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    fgColor: '#374151',
    bgColor: '#ffffff',
    style: 'dots',
  },
  {
    id: 'creative',
    name: 'Creative',
    fgColor: '#7c3aed',
    bgColor: '#fef3c7',
    gradient: {
      type: 'linear',
      colors: ['#7c3aed', '#ec4899'],
      rotation: 45,
    },
    style: 'dots',
  },
];

export const FONT_OPTIONS = [
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
];

export const TEXT_PRESETS = [
  'Scan Me',
  'Visit My Website',
  'Pay Now',
  'Learn More',
  'Get Started',
  'Follow Us',
];

export const EXPORT_DIMENSIONS = [
  { label: '256 × 256', width: 256, height: 256 },
  { label: '512 × 512', width: 512, height: 512 },
  { label: '1024 × 1024', width: 1024, height: 1024 },
  { label: '2048 × 2048', width: 2048, height: 2048 },
];
