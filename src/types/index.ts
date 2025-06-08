// 平台类型定义
export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  backgroundColor: string;
  domain: string;
}

// 用户信息类型
export interface Author {
  name: string;
  avatar: string;
  username: string;
}

// 内容统计信息
export interface ContentStats {
  likes: number;
  comments: number;
  shares: number;
}

// 聚合内容类型
export interface FeedItem {
  id: string;
  platform: string;
  author: Author;
  content: string;
  summary: string;
  timestamp: string;
  originalUrl: string;
  type: 'article' | 'video' | 'tweet' | 'lifestyle';
  tags: string[];
  stats: ContentStats;
}

// 关注用户类型
export interface FollowedUser {
  id: string;
  platform: string;
  username: string;
  name: string;
  avatar: string;
  description: string;
  profileUrl: string;
  followedAt: string;
  isActive: boolean;
}

// 筛选选项类型
export interface FilterOptions {
  platforms: string[];
  contentTypes: string[];
  timeRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'newest' | 'popular' | 'engagement';
}

// 搜索选项类型
export interface SearchOptions {
  query: string;
  inContent: boolean;
  inAuthor: boolean;
  inTags: boolean;
}
