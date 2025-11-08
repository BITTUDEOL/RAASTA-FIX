import { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import ReportForm from './components/ReportForm';
import MapView from './components/MapView';
import RecentReports from './components/RecentReports';
import Stats from './components/Stats';
import ReportModal from './components/ReportModal';
import AIChatbot from './components/AIChatbot';
import VoiceControl from './components/VoiceControl';
import Analytics from './components/Analytics';
import { Report, User, Theme } from './types';
import { storageUtils } from './utils/storage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthorityAuth, setShowAuthorityAuth] = useState(false);

  useEffect(() => {
    const savedUser = storageUtils.getCurrentUser();
    if (savedUser) {
      const updatedUser = {
        ...savedUser,
        notifications: savedUser.notifications || [],
        reportsSubmitted: savedUser.reportsSubmitted || 0,
        reportsResolved: savedUser.reportsResolved || 0,
        reputation: savedUser.reputation || 0,
        joinedAt: savedUser.joinedAt || new Date().toISOString()
      };
      setCurrentUser(updatedUser);
    } else {
      setShowAuthModal(true);
    }

    const savedReports = storageUtils.getReports();
    const migratedReports = savedReports.map(report => ({
      ...report,
      upvotes: report.upvotes || 0,
      downvotes: report.downvotes || 0,
      votedBy: report.votedBy || [],
      comments: report.comments || [],
      views: report.views || 0,
      shareCount: report.shareCount || 0,
      tags: report.tags || [report.type],
      reportedByEmail: report.reportedByEmail || 'user@example.com'
    }));
    setReports(migratedReports);

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAuth = (user: User) => {
    const newUser = {
      ...user,
      notifications: [],
      reportsSubmitted: 0,
      reportsResolved: 0,
      reputation: 100,
      joinedAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    storageUtils.setCurrentUser(newUser);
    storageUtils.saveUser(newUser);
  };

  const handleSubmitReport = (report: Report) => {
    storageUtils.saveReport(report);
    setReports([...reports, report]);

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        reportsSubmitted: currentUser.reportsSubmitted + 1,
        reputation: currentUser.reputation + 10
      };
      setCurrentUser(updatedUser);
      storageUtils.setCurrentUser(updatedUser);
    }
  };

  const handleApproveReport = (reportId: string) => {
    if (!currentUser || currentUser.role !== 'authority') return;
    const updates: Partial<Report> = {
      status: 'in-progress'
    };
    storageUtils.updateReport(reportId, updates);
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, ...updates } : r
      )
    );
    setSelectedReport(null);
  };

  const handleResolveReport = (reportId: string) => {
    if (!currentUser || currentUser.role !== 'authority') return;
    const updates: Partial<Report> = {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolvedBy: currentUser.name
    };
    storageUtils.updateReport(reportId, updates);
    setReports(
      reports.map((r) =>
        r.id === reportId ? { ...r, ...updates } : r
      )
    );
    const updatedUser = {
      ...currentUser,
      reportsResolved: currentUser.reportsResolved + 1,
      reputation: currentUser.reputation + 25
    };
    setCurrentUser(updatedUser);
    storageUtils.setCurrentUser(updatedUser);
    setSelectedReport(null);
  };

  const handleAuthorityClick = () => {
    if (!currentUser || currentUser.role !== 'authority') {
      setShowAuthorityAuth(true);
      return;
    }
    // Already authority, no change needed.
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleReportClick = (report: Report) => {
    const updatedReports = reports.map(r =>
      r.id === report.id ? { ...r, views: r.views + 1 } : r
    );
    setReports(updatedReports);
    storageUtils.updateReport(report.id, { views: report.views + 1 });
    setSelectedReport(updatedReports.find(r => r.id === report.id) || report);
  };

  const handleAuthClick = () => {
    if (currentUser) {
      if (confirm('Are you sure you want to sign out?')) {
        setCurrentUser(null);
        storageUtils.setCurrentUser(null);
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'open-report':
        document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'show-map':
        document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'my-reports':
        setFilterType('my-reports');
        break;
      case 'help':
        break;
      case 'toggle-theme':
        handleToggleTheme();
        break;
    }
  };

  const filteredReports = reports.filter(report => {
    if (filterType === 'my-reports' && currentUser) {
      if (report.reportedByEmail !== currentUser.email) return false;
    }
    if (filterType !== 'all' && filterType !== 'my-reports') {
      if (report.type !== filterType) return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.title.toLowerCase().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        report.location.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-white to-red-50'}`}>
      <Header
        currentUser={currentUser}
        onToggleTheme={handleToggleTheme}
        isDark={isDark}
        onAuthClick={handleAuthClick}
        onToggleRole={handleAuthorityClick}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent`}>
            Smart Civic Reporting Platform
          </h1>
          <p className={`text-lg md:text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            AI-powered voice assistance | Report issues, track progress
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md`}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`px-4 py-3 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md`}
            >
              <option value="all">All</option>
              {currentUser && <option value="my-reports">My Reports</option>}
              <option value="pothole">Potholes</option>
              <option value="streetlight">Streetlights</option>
              <option value="water-leak">Water Leak</option>
              <option value="waste">Waste</option>
              <option value="manhole">Manhole</option>
            </select>
          </div>
        </div>

        <Stats reports={filteredReports} isDark={isDark} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div id="report-form" className="lg:col-span-1">
            {currentUser ? (
              <ReportForm
                onSubmit={handleSubmitReport}
                currentUserName={currentUser.name}
                currentUserEmail={currentUser.email}
                isDark={isDark}
              />
            ) : (
              <div className={`rounded-2xl shadow-lg p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-6xl mb-4">🚧</div>
                <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Please sign in to report issues
                </p>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Please sign in to report issues
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <MapView reports={filteredReports} onReportClick={handleReportClick} isDark={isDark} />
          </div>
        </div>

        <RecentReports reports={filteredReports} isDark={isDark} />
      </main>

      {showAuthModal && !currentUser && (
        <AuthModal onClose={() => setShowAuthModal(false)} onAuth={handleAuth} isDark={isDark} />
      )}

      {showAuthorityAuth && (
        <AuthModal
          onClose={() => setShowAuthorityAuth(false)}
          onAuth={user => {
            if (user.role === 'authority') {
              setCurrentUser(user);
              storageUtils.setCurrentUser(user);
              storageUtils.saveUser(user);
              setShowAuthorityAuth(false);
            }
          }}
          isDark={isDark}
        />
      )}

      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onApprove={handleApproveReport}
          onResolve={handleResolveReport}
          canApprove={currentUser?.role === 'authority' && selectedReport.status === 'pending'}
          canResolve={currentUser?.role === 'authority' && selectedReport.status === 'in-progress'}
          isDark={isDark}
        />
      )}

      {showAnalytics && (
        <Analytics
          reports={reports}
          isDark={isDark}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      <AIChatbot isDark={isDark} />
      <VoiceControl isDark={isDark} onCommand={handleVoiceCommand} />
    </div>
  );
}

export default App;
