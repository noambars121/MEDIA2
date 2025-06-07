'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/Button';
// import { Moon, Sun } from 'lucide-react'; // Example icons

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted before rendering UI that depends on theme
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null during SSR / hydration
    return <Button variant="ghost" size="icon" disabled className="w-9 h-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        // <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span>🌙</span> // Placeholder Moon Icon
      ) : (
        // <Moon className="h-[1.2rem] w-[1.2rem]" />
        <span>☀️</span> // Placeholder Sun Icon
      )}
    </Button>
  );
} 