'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Video, Upload, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-600 text-white p-1 rounded-lg">
              <Video size={24} />
            </div>
            <span className="font-bold text-xl tracking-tighter">KorczeTube</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <>
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-2 rounded-full font-medium text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <LayoutDashboard size={18} />
                      <span>Studio</span>
                    </Link>
                    <Link 
                      href="/admin/upload" 
                      className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-full font-medium text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Upload size={18} />
                      <span>Dodaj film</span>
                    </Link>
                  </>
                )}
                <Link href="/profile" className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1 pr-3 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <UserIcon size={16} />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                  </Link>
                <button 
                  onClick={logout}
                  className="text-zinc-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login"
                className="flex items-center gap-2 border border-zinc-300 dark:border-zinc-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <UserIcon size={18} />
                Zaloguj się
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
