import { TrendingUp, Clock, CheckCircle, AlertCircle, Download, BarChart3 } from 'lucide-react';
import { Report } from '../types';
import { calculateAnalytics, getIssueTypeStats, getReportTrends, downloadCSV } from '../utils/analytics';

interface AnalyticsProps {
  reports: Report[];
  isDark: boolean;
  onClose: () => void;
}

export default function Analytics({ reports, isDark, onClose }: AnalyticsProps) {
  const analytics = calculateAnalytics(reports);
  const issueStats = getIssueTypeStats(reports);
  const trends = getReportTrends(reports);

  const issueTypeLabels: { [key: string]: string } = {
    pothole: 'Pothole',
    streetlight: 'Streetlight',
    'water-leak': 'Water Leak',
    waste: 'Waste',
    manhole: 'Manhole'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`w-full max-w-6xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`sticky top-0 z-10 p-6 border-b ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className={`w-8 h-8 ${isDark ? 'text-orange-500' : 'text-orange-600'}`} />
              <div>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Analytics Dashboard
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete report analytics and statistics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => downloadCSV(reports)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export CSV</span>
              </button>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-500 to-blue-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{analytics.totalReports}</span>
              </div>
              <p className="text-sm opacity-90">Total Reports</p>
              <p className="text-xs opacity-75 mt-1">This month: {analytics.reportsThisMonth}</p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-green-900 to-green-800' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{analytics.resolvedReports}</span>
              </div>
              <p className="text-sm opacity-90">Resolved</p>
              <p className="text-xs opacity-75 mt-1">Rate: {analytics.resolutionRate}%</p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-yellow-900 to-yellow-800' : 'bg-gradient-to-br from-yellow-500 to-yellow-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{analytics.avgResolutionTime}h</span>
              </div>
              <p className="text-sm opacity-90">Average Time</p>
              <p className="text-xs opacity-75 mt-1">to Resolve</p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-red-900 to-red-800' : 'bg-gradient-to-br from-red-500 to-red-600'} text-white`}>
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8 opacity-80" />
                <span className="text-3xl font-bold">{analytics.totalReports - analytics.resolvedReports}</span>
              </div>
              <p className="text-sm opacity-90">Pending</p>
              <p className="text-xs opacity-75 mt-1">Awaiting solution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Issue Type Analysis</h3>
              <div className="space-y-3">
                {Object.entries(issueStats).map(([type, stats]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {issueTypeLabels[type]}
                      </span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stats.total} ({stats.resolved} resolved)</span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${analytics.totalReports > 0 ? (stats.total / analytics.totalReports) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Trend in Last 7 Days</h3>
              <div className="space-y-2">
                {trends.map((day, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className={`text-xs font-medium w-16 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day.date}
                    </span>
                    <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full flex items-center justify-end px-2 transition-all"
                        style={{
                          width: `${Math.max((day.count / Math.max(...trends.map(t => t.count))) * 100, 5)}%`
                        }}
                      >
                        <span className="text-xs font-bold text-white">{day.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border-2 ${
            isDark ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'
          }`}>
            <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>📊 Key Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Most common issue</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {issueTypeLabels[analytics.topIssueType] || 'N/A'}
                </p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Resolution rate</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.resolutionRate}%
                </p>
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg. resolution time</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {analytics.avgResolutionTime} hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
