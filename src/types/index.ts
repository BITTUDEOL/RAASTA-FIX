export interface Report {
  id: string;
  type: 'pothole' | 'streetlight' | 'water-leak' | 'waste' | 'manhole';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    ward?: string;
    city?: string;
  };
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  imageUrl?: string;
  isRainyHazard: boolean;
  reportedBy: string;
  reportedByEmail: string;
  reportedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  comments: Comment[];
  views: number;
  shareCount: number;
  estimatedCost?: number;
  estimatedTime?: string;
  assignedTo?: string;
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'authority' | 'admin';
  phone?: string;
  avatar?: string;
  govId?: string; // Authority only
  password?: string; // Authority only
  reportsSubmitted: number;
  reportsResolved: number;
  reputation: number;
  joinedAt: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'report_update' | 'comment' | 'resolution' | 'upvote' | 'system';
  message: string;
  reportId?: string;
  read: boolean;
  timestamp: string;
}

export type Theme = 'light' | 'dark';

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
  audioUrl?: string;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

export interface AnalyticsData {
  totalReports: number;
  resolvedReports: number;
  avgResolutionTime: number;
  topIssueType: string;
  reportsThisMonth: number;
  resolutionRate: number;
}
