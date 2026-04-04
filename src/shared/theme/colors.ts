export const colors = {
  // Stock market theme
  primary: '#00D084', // Green for gains
  secondary: '#FF6B6B', // Red for losses
  accent: '#FFD93D', // Yellow for highlights
  
  // Neutral colors
  background: '#0A0E27', // Dark background
  surface: '#1A1F3A', // Card/surface background
  text: '#FFFFFF', // Primary text
  textSecondary: '#B0B8D4', // Secondary text
  border: '#2D3556', // Border color
  divider: '#464D6E', // Divider color
  
  // Semantic colors
  error: '#FF6B6B',
  success: '#00D084',
  warning: '#FFD93D',
  info: '#6C5CE7',
};

export type ColorKey = keyof typeof colors;
