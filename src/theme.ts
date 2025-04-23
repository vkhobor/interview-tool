import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: 6,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  headings: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
      h1: { fontSize: '2rem', lineHeight: 1.2 },
      h2: { fontSize: '1.5rem', lineHeight: 1.3 },
      h3: { fontSize: '1.25rem', lineHeight: 1.4 },
    },
  },
  colors: {
    blue: [
      '#E6F7FF', '#BAE7FF', '#91D5FF', '#69C0FF', '#40A9FF',
      '#1890FF', '#096DD9', '#0050B3', '#003A8C', '#002766'
    ],
    teal: [
      '#E6FFFB', '#B5F5EC', '#87E8DE', '#5CDBD3', '#36CFC9',
      '#13C2C2', '#08979C', '#006D75', '#00474F', '#002329'
    ],
    gray: [
      '#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF',
      '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'
    ],
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
        p: 'md',
      },
    },
  },
});