'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme, manrope, spaceGrotesk } from './mui-theme';

// Create theme instance
const theme = createAppTheme();

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style jsx global>{`
        :root {
          --font-manrope: ${manrope.style.fontFamily};
          --font-space-grotesk: ${spaceGrotesk.style.fontFamily};
        }
      `}</style>
      {children}
    </ThemeProvider>
  );
}
