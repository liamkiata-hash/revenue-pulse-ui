import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-2 border-slate-200 dark:border-slate-800 shadow-xl">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 ${theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}`}
        >
          <Sun size={16} />
          <span className="font-bold text-sm">Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 ${theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}`}
        >
          <Moon size={16} />
          <span className="font-bold text-sm">Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 ${theme === 'system' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''}`}
        >
          <Laptop size={16} />
          <span className="font-bold text-sm">Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};