import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      light: '#16213e',
      dark: '#0f0f1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e86c2f',
      light: '#ff8c4b',
      dark: '#c4521a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f5f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#5c5c7a',
    },
    success: { main: '#2e7d32' },
    error: { main: '#c62828' },
    divider: 'rgba(26,26,46,0.1)',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h2: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h3: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h4: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h5: { fontFamily: '"DM Serif Display", serif', fontWeight: 400 },
    h6: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.9rem',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #16213e 0%, #0f0f1a 100%)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #e86c2f 0%, #ff8c4b 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #c4521a 0%, #e86c2f 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(26,26,46,0.06)',
          border: '1px solid rgba(26,26,46,0.07)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: 'rgba(26,26,46,0.15)' },
            '&:hover fieldset': { borderColor: 'rgba(26,26,46,0.3)' },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
      },
    },
  },
});

export default theme;
