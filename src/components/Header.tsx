import { Moon, Sun, User, Shield, Bell, BarChart3 } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  currentUser: UserType | null;
  onToggleTheme: () => void;
  isDark: boolean;
  onAuthClick: () => void;
  onToggleRole: () => void;
  onOpenAnalytics: () => void;
}

export default function Header({ currentUser, onToggleTheme, isDark, onAuthClick, onToggleRole, onOpenAnalytics }: HeaderProps) {
  const unreadNotifications = currentUser?.notifications?.filter(n => !n.read).length || 0;
  return (
    <header className={`sticky top-0 z-50 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <span className="text-2xl font-bold text-white">🛣️</span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent`}>
                RaastaFix
              </h1>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-Powered Civic Solutions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser && (
              <>
                <button
                  onClick={onOpenAnalytics}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Analytics Dashboard"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button
                  className={`relative p-2 rounded-lg transition-colors ${
                    isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </>
            )}
            {/* Authority access button */}
            {currentUser && (
              <button
                onClick={onToggleRole}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  currentUser.role === 'authority'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                    : isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {currentUser.role === 'authority' ? 'Authority' : 'Switch to Authority'}
                </span>
              </button>
            )}

            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={onAuthClick}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg transition-all`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                {currentUser ? currentUser.name : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {currentUser?.role === 'authority' && (
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 text-center text-sm font-medium shadow-lg">
          🛡️ AUTHORITY MODE ACTIVE - Click pins on the map to resolve issues
        </div>
      )}
    </header>
  );
}
