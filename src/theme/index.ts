import { defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          200: { value: '#90caf9' },
          300: { value: '#64b5f6' },
          400: { value: '#42a5f5' },
          500: { value: '#2196f3' },
          600: { value: '#1e88e5' },
          700: { value: '#1976d2' },
          800: { value: '#1565c0' },
          900: { value: '#0d47a1' },
        },
        node: {
          trigger: {
            50: { value: '#f0fff4' },
            100: { value: '#c6f6d5' },
            500: { value: '#38a169' },
            600: { value: '#2f855a' },
          },
          action: {
            50: { value: '#ebf8ff' },
            100: { value: '#bee3f8' },
            500: { value: '#3182ce' },
            600: { value: '#2b77cb' },
          },
          logic: {
            50: { value: '#fffaf0' },
            100: { value: '#feebc8' },
            500: { value: '#dd6b20' },
            600: { value: '#c05621' },
          },
          output: {
            50: { value: '#fed7d7' },
            100: { value: '#feb2b2' },
            500: { value: '#e53e3e' },
            600: { value: '#c53030' },
          },
        },
      },
      fonts: {
        heading: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
        body: { value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
      },
      fontSizes: {
        xs: { value: '0.75rem' },
        sm: { value: '0.875rem' },
        md: { value: '1rem' },
        lg: { value: '1.125rem' },
        xl: { value: '1.25rem' },
        '2xl': { value: '1.5rem' },
        '3xl': { value: '1.875rem' },
        '4xl': { value: '2.25rem' },
        '5xl': { value: '3rem' },
        '6xl': { value: '3.75rem' },
      },
    },
    semanticTokens: {
      colors: {
        'brand.solid': {
          default: { value: '{colors.brand.500}' },
          _dark: { value: '{colors.brand.400}' },
        },
        'brand.contrast': {
          default: { value: 'white' },
          _dark: { value: 'white' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: 'gray.50',
      color: 'gray.900',
    },
    '*::placeholder': {
      color: 'gray.400',
    },
  },
});

export default config;