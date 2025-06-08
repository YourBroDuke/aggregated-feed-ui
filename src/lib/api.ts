import { Platform, FeedItem, FollowedUser } from '@/types';

// 获取平台配置数据
export async function fetchPlatforms(): Promise<Platform[]> {
  try {
    const response = await fetch('/data/platforms.json');
    if (!response.ok) {
      throw new Error('获取平台数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取平台数据时出错:', error);
    return [];
  }
}

// 获取聚合内容数据
export async function fetchFeedData(): Promise<FeedItem[]> {
  try {
    const response = await fetch('/data/feed-data.json');
    if (!response.ok) {
      throw new Error('获取Feed数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取Feed数据时出错:', error);
    return [];
  }
}

// 获取关注用户列表
export async function fetchFollowedUsers(): Promise<FollowedUser[]> {
  try {
    const response = await fetch('/data/followed-users.json');
    if (!response.ok) {
      throw new Error('获取关注用户数据失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取关注用户数据时出错:', error);
    return [];
  }
}

// 模拟添加关注用户
export async function addFollowedUser(profileUrl: string): Promise<FollowedUser | null> {
  // 这里模拟解析用户链接并返回用户信息
  // 在实际应用中，这会调用后端API进行解析
  
  console.log('正在解析用户链接:', profileUrl);
  
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 简单的URL解析逻辑（实际应用中需要更复杂的解析）
  let platform = '';
  let username = '';
  
  if (profileUrl.includes('zhihu.com')) {
    platform = 'zhihu';
    username = profileUrl.split('/').pop() || 'unknown';
  } else if (profileUrl.includes('xiaohongshu.com')) {
    platform = 'xiaohongshu';
    username = profileUrl.split('/').pop() || 'unknown';
  } else if (profileUrl.includes('bilibili.com')) {
    platform = 'bilibili';
    username = profileUrl.split('/').pop() || 'unknown';
  } else if (profileUrl.includes('twitter.com')) {
    platform = 'twitter';
    username = profileUrl.split('/').pop() || 'unknown';
  } else if (profileUrl.includes('youtube.com')) {
    platform = 'youtube';
    username = profileUrl.split('@')[1] || profileUrl.split('/').pop() || 'unknown';
  } else {
    throw new Error('不支持的平台链接');
  }
  
  // 模拟返回新用户数据
  const newUser: FollowedUser = {
    id: Date.now().toString(),
    platform,
    username,
    name: `新用户_${username}`,
    avatar: '/images/avatar-placeholder.jpg',
    description: '通过链接添加的新用户',
    profileUrl,
    followedAt: new Date().toISOString(),
    isActive: true
  };
  
  return newUser;
}

// 模拟取消关注用户
export async function unfollowUser(userId: string): Promise<boolean> {
  console.log('取消关注用户:', userId);
  
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

// 格式化时间显示
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '刚刚';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}分钟前`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}小时前`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}天前`;
  } else {
    return time.toLocaleDateString('zh-CN');
  }
}

// 格式化数字显示（如点赞数）
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 10000) {
    return `${(num / 1000).toFixed(1)}k`;
  } else if (num < 100000000) {
    return `${(num / 10000).toFixed(1)}万`;
  } else {
    return `${(num / 100000000).toFixed(1)}亿`;
  }
}
