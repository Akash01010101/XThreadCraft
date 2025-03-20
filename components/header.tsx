"use client";

import Link from "next/link";
import { Twitter } from "lucide-react";
import { Moon, Sun, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

export function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <Twitter className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">XThreadCraft</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/thread" className="text-muted-foreground hover:text-foreground transition-colors">New Thread</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            
          </div>
        </div>
        {/* Theme toggle and sign-out buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => signOut()}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <LogOut className="h-6 w-6 text-primary" />
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-6 w-6 text-primary" />
          ) : (
            <Moon className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>
      </nav>
    </header>
  );
}