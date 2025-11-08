import { Report, User } from '../types';

const REPORTS_KEY = 'raastafix_reports';
const USERS_KEY = 'raastafix_users';
const CURRENT_USER_KEY = 'raastafix_current_user';

export const storageUtils = {
  getReports(): Report[] {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveReport(report: Report): void {
    const reports = this.getReports();
    reports.push(report);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },

  updateReport(reportId: string, updates: Partial<Report>): void {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    }
  },

  deleteReport(reportId: string): void {
    const reports = this.getReports().filter(r => r.id !== reportId);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};
