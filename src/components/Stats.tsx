import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Report } from '../types';

interface StatsProps {
  reports: Report[];
  isDark: boolean;
}

export default function Stats({ reports, isDark }: StatsProps) {
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const inProgressReports = reports.filter((r) => r.status === 'in-progress').length;
  const resolvedReports = reports.filter((r) => r.status === 'resolved').length;
  const criticalReports = reports.filter((r) => r.isRainyHazard).length;

  const stats = [
    {
      label: 'Total Reports',
      value: totalReports,
      icon: TrendingUp,
      color: 'blue',
      bgColor: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Pending',
      value: pendingReports,
      icon: Clock,
      color: 'yellow',
      bgColor: isDark ? 'bg-yellow-900/20' : 'bg-yellow-50',
      iconColor: 'text-yellow-500'
    },
    {
      label: 'In Progress',
      value: inProgressReports,
      icon: AlertCircle,
      color: 'purple',
      bgColor: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      label: 'Resolved',
      value: resolvedReports,
      icon: CheckCircle,
      color: 'green',
      bgColor: isDark ? 'bg-green-900/20' : 'bg-green-50',
      iconColor: 'text-green-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.label === 'Pending' && criticalReports > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {criticalReports} 🚨
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
