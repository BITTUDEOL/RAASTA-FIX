import { Clock, MapPin, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Report } from '../types';

interface RecentReportsProps {
  reports: Report[];
  isDark: boolean;
}

const statusIcons = {
  pending: AlertCircle,
  'in-progress': Loader,
  resolved: CheckCircle
};

const statusColors = {
  pending: 'text-yellow-500',
  'in-progress': 'text-blue-500',
  resolved: 'text-green-500'
};

export default function RecentReports({ reports, isDark }: RecentReportsProps) {
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  const recentReports = sortedReports.slice(0, 10);

  return (
    <div className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Reports</h2>

      {recentReports.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No reports yet</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Be the first to report a civic issue!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentReports.map((report) => {
            const StatusIcon = statusIcons[report.status];

            return (
              <div
                key={report.id}
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl flex-shrink-0">{getIssueEmoji(report.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                          {report.title}
                        </h3>
                        {report.isRainyHazard && (
                          <span className="flex-shrink-0 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                            🚨 HAZARD
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <StatusIcon className={`w-5 h-5 flex-shrink-0 ml-2 ${statusColors[report.status]}`} />
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{report.location.address.split(',').slice(0, 2).join(',')}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(report.reportedAt)}</span>
                  </div>
                </div>

                {report.imageUrl && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img src={report.imageUrl} alt={report.title} className="w-full h-32 object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    By {report.reportedBy}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      report.status === 'resolved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : report.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}
                  >
                    {report.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getIssueEmoji(type: Report['type']): string {
  const emojis = {
    pothole: '🕳️',
    streetlight: '💡',
    'water-leak': '💧',
    waste: '🗑️',
    manhole: '⚠️'
  };
  return emojis[type];
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString();
}
