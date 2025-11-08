import { X, User, Mail, Phone } from 'lucide-react';
import { useState } from 'react';
// import { User as UserType } from '../types';
import { User as UserType } from '../types';
interface AuthModalProps {
  onClose: () => void;
  onAuth: (user: UserType) => void;
  isDark: boolean;
}

export default function AuthModal({ onClose, onAuth, isDark }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signupMode, setSignupMode] = useState<'citizen' | 'authority'>('citizen');
  const [govId, setGovId] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!name.trim() || !email.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (signupMode === 'authority') {
      if (!govId.trim() || !password.trim()) {
        setAuthError('Government ID and password are required.');
        return;
      }
      const user: UserType = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: 'authority',
        govId: govId.trim(),
        password: password.trim(),
        reportsSubmitted: 0,
        reportsResolved: 0,
        reputation: 100,
        joinedAt: new Date().toISOString(),
        notifications: []
      };
      onAuth(user);
      onClose();
      return;
    }
    // Citizen signup
    const user: UserType = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'citizen',
      reportsSubmitted: 0,
      reportsResolved: 0,
      reputation: 100,
      joinedAt: new Date().toISOString(),
      notifications: []
    };
    onAuth(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
              Welcome to RaastaFix
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to RaastaFix</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-row justify-between p-6 pt-4 pb-0">
          <button onClick={() => setSignupMode('citizen')} className={`px-4 py-2 font-bold rounded-lg ${signupMode === 'citizen' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}>Citizen</button>
          <button onClick={() => setSignupMode('authority')} className={`px-4 py-2 font-bold rounded-lg ${signupMode === 'authority' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}>Authority</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          {signupMode === 'authority' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Government ID *</label>
                <input
                  type="text"
                  value={govId}
                  onChange={e => setGovId(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Enter your government ID number"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Create a password"
                  required
                />
              </div>
            </>
          )}
          {authError && <div className="text-red-500 text-sm">{authError}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Get Started
          </button>

          <p className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            By signing in you agree to help in making your city better
          </p>
        </form>
      </div>
    </div>
  );
}
