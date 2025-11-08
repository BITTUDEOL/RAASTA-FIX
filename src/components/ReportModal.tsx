import { X, MapPin, Calendar, User, CheckCircle } from 'lucide-react';
import { Report } from '../types';

interface ReportModalProps {
  report: Report;
  onClose: () => void;
  onApprove?: (reportId: string) => void;
  onResolve?: (reportId: string) => void;
  canApprove: boolean;
  canResolve: boolean;
  isDark: boolean;
}

export default function ReportModal({ report, onClose, onApprove, onResolve, canApprove, canResolve, isDark }: ReportModalProps) {
  const statusColors = {
    pending: 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    resolved: 'bg-green-500'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getIssueEmoji(report.type)}</span>
            <div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{report.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[report.status]}`}>
                  {report.status.toUpperCase()}
                </span>
                {report.isRainyHazard && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">🚨 WEATHER HAZARD</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {report.imageUrl && (
            <div className="rounded-xl overflow-hidden">
              <img src={report.imageUrl} alt={report.title} className="w-full h-64 object-cover" />
            </div>
          )}

          <div>
            <h3 className={`text-sm font-semibold uppercase mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Description
            </h3>
            <p className={`text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {report.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <MapPin className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Location
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{report.location.address}</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {report.location.lat.toFixed(4)}, {report.location.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <Calendar className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reported On
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(report.reportedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <User className={`w-5 h-5 mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reported By
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{report.reportedBy}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 text-center">
                  {report.priority === 'critical' ? '🔴' : report.priority === 'high' ? '🟠' : '🟡'}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Priority
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                    {report.priority}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {report.resolvedAt && (
            <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-700'}`}>Resolved</h4>
              </div>
              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                This issue was resolved on{' '}
                {new Date(report.resolvedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {report.resolvedBy && ` by ${report.resolvedBy}`}
              </p>
            </div>
          )}

          {canApprove && report.status === 'pending' && onApprove && (
            <button
              onClick={() => onApprove(report.id)}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl transition-colors mb-3"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Approve & Assign to Worker</span>
            </button>
          )}
          {canResolve && report.status === 'in-progress' && onResolve && (
            <button
              onClick={() => onResolve(report.id)}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Fixed & Resolved</span>
            </button>
          )}

          {report.isRainyHazard && (
            <div className={`p-4 rounded-xl ${isDark ? 'bg-red-900/20 border-2 border-red-800' : 'bg-red-50 border-2 border-red-200'}`}>
              <h4 className={`font-bold mb-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>⚠️ Weather Alert</h4>
              <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                This issue has been flagged as a potential hazard due to current rainy conditions. Please exercise
                extreme caution in this area and prioritize resolution.
              </p>
            </div>
          )}
        </div>
      </div>
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
