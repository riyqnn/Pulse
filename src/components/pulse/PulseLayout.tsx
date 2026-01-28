import type { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, BarChart3, User, Home } from 'lucide-react';
import { clsx } from 'clsx';

export default function PulseLayout({ children }: PropsWithChildren) {
  const location = useLocation();

  const navItems = [
    { to: '/pulse', icon: Zap, label: 'Pulse Feed' },
    { to: '/pulse/mastery', icon: BarChart3, label: 'Mastery' },
    { to: '/pulse/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Pulse Logo"
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="font-bold text-xl text-white">Pulse</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
                      isActive
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/60 hover:border-white/10 border border-transparent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/"
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200',
                  'text-gray-400 hover:text-white hover:bg-slate-800/60 hover:border-white/10 border border-transparent'
                )}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/80 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={clsx(
                    'flex flex-col items-center gap-1 py-2 px-4 rounded-xl font-medium transition-all duration-200',
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : 'text-gray-500 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/"
              className={clsx(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-xl font-medium transition-all duration-200',
                'text-gray-500 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {children}
      </main>
    </div>
  );
}
