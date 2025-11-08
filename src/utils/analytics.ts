import { Report, AnalyticsData } from '../types';

export const calculateAnalytics = (reports: Report[]): AnalyticsData => {
  if (reports.length === 0) {
    return {
      totalReports: 0,
      resolvedReports: 0,
      avgResolutionTime: 0,
      topIssueType: 'none',
      reportsThisMonth: 0,
      resolutionRate: 0
    };
  }

  const resolvedReports = reports.filter(r => r.status === 'resolved');
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const reportsThisMonth = reports.filter(r => {
    const reportDate = new Date(r.reportedAt);
    return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
  }).length;

  let totalResolutionTime = 0;
  resolvedReports.forEach(report => {
    if (report.resolvedAt) {
      const reported = new Date(report.reportedAt).getTime();
      const resolved = new Date(report.resolvedAt).getTime();
      totalResolutionTime += (resolved - reported) / (1000 * 60 * 60);
    }
  });

  const avgResolutionTime = resolvedReports.length > 0
    ? Math.round(totalResolutionTime / resolvedReports.length)
    : 0;

  const issueTypeCounts: { [key: string]: number } = {};
  reports.forEach(report => {
    issueTypeCounts[report.type] = (issueTypeCounts[report.type] || 0) + 1;
  });

  const topIssueType = Object.entries(issueTypeCounts).reduce((a, b) =>
    b[1] > a[1] ? b : a, ['none', 0]
  )[0];

  const resolutionRate = reports.length > 0
    ? Math.round((resolvedReports.length / reports.length) * 100)
    : 0;

  return {
    totalReports: reports.length,
    resolvedReports: resolvedReports.length,
    avgResolutionTime,
    topIssueType,
    reportsThisMonth,
    resolutionRate
  };
};

export const getIssueTypeStats = (reports: Report[]) => {
  const stats: { [key: string]: { total: number; resolved: number; pending: number } } = {
    pothole: { total: 0, resolved: 0, pending: 0 },
    streetlight: { total: 0, resolved: 0, pending: 0 },
    'water-leak': { total: 0, resolved: 0, pending: 0 },
    waste: { total: 0, resolved: 0, pending: 0 },
    manhole: { total: 0, resolved: 0, pending: 0 }
  };

  reports.forEach(report => {
    stats[report.type].total++;
    if (report.status === 'resolved') {
      stats[report.type].resolved++;
    } else {
      stats[report.type].pending++;
    }
  });

  return stats;
};

export const getReportTrends = (reports: Report[]) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: 0
    };
  });

  reports.forEach(report => {
    const reportDate = new Date(report.reportedAt);
    const daysDiff = Math.floor((Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 0 && daysDiff < 7) {
      const index = 6 - daysDiff;
      if (last7Days[index]) {
        last7Days[index].count++;
      }
    }
  });

  return last7Days;
};

export const exportToCSV = (reports: Report[]): string => {
  const headers = ['ID', 'Type', 'Title', 'Status', 'Priority', 'Location', 'Reported By', 'Reported At', 'Resolved At', 'Upvotes'];

  const rows = reports.map(report => [
    report.id,
    report.type,
    report.title,
    report.status,
    report.priority,
    report.location.address,
    report.reportedBy,
    new Date(report.reportedAt).toLocaleString(),
    report.resolvedAt ? new Date(report.resolvedAt).toLocaleString() : 'N/A',
    report.upvotes.toString()
  ]);

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

export const downloadCSV = (reports: Report[], filename: string = 'raastafix-reports.csv') => {
  const csv = exportToCSV(reports);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
