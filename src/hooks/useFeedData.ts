import { useState, useEffect, useMemo } from 'react';
import { Platform, FeedItem, FollowedUser, FilterOptions, SearchOptions } from '@/types';
import { fetchPlatforms, fetchFeedData, fetchFollowedUsers } from '@/lib/api';

export function useFeedData() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // 筛选和搜索状态
  const [filters, setFilters] = useState<FilterOptions>({
    platforms: [],
    contentTypes: [],
    timeRange: 'all',
    sortBy: 'newest'
  });

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    inContent: true,
    inAuthor: true,
    inTags: true
  });

  // 初始化数据加载
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [platformsData, feedData, usersData] = await Promise.all([
        fetchPlatforms(),
        fetchFeedData(),
        fetchFollowedUsers()
      ]);

      setPlatforms(platformsData);
      setFeedItems(feedData);
      setFollowedUsers(usersData);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据时发生错误');
    } finally {
      setLoading(false);
    }
  };

  // 手动刷新数据
  const refreshData = () => {
    loadAllData();
  };

  // 筛选和搜索逻辑
  const filteredFeedItems = useMemo(() => {
    let items = [...feedItems];

    // 平台筛选
    if (filters.platforms.length > 0) {
      items = items.filter(item => filters.platforms.includes(item.platform));
    }

    // 内容类型筛选
    if (filters.contentTypes.length > 0) {
      items = items.filter(item => filters.contentTypes.includes(item.type));
    }

    // 时间范围筛选
    if (filters.timeRange !== 'all') {
      const now = new Date();
      const timeThreshold = new Date();
      
      switch (filters.timeRange) {
        case 'today':
          timeThreshold.setHours(0, 0, 0, 0);
          break;
        case 'week':
          timeThreshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          timeThreshold.setMonth(now.getMonth() - 1);
          break;
      }
      
      items = items.filter(item => new Date(item.timestamp) >= timeThreshold);
    }

    // 搜索筛选
    if (searchOptions.query.trim()) {
      const query = searchOptions.query.toLowerCase();
      items = items.filter(item => {
        const matchInContent = searchOptions.inContent && 
          (item.content.toLowerCase().includes(query) || 
           item.summary.toLowerCase().includes(query));
        
        const matchInAuthor = searchOptions.inAuthor && 
          item.author.name.toLowerCase().includes(query);
        
        const matchInTags = searchOptions.inTags && 
          item.tags.some(tag => tag.toLowerCase().includes(query));
        
        return matchInContent || matchInAuthor || matchInTags;
      });
    }

    // 排序
    switch (filters.sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'popular':
        items.sort((a, b) => b.stats.likes - a.stats.likes);
        break;
      case 'engagement':
        items.sort((a, b) => {
          const engagementA = a.stats.likes + a.stats.comments + a.stats.shares;
          const engagementB = b.stats.likes + b.stats.comments + b.stats.shares;
          return engagementB - engagementA;
        });
        break;
    }

    return items;
  }, [feedItems, filters, searchOptions]);

  // 获取平台信息的辅助函数
  const getPlatformInfo = (platformId: string): Platform | undefined => {
    return platforms.find(p => p.id === platformId);
  };

  // 添加关注用户
  const addFollowedUser = (user: FollowedUser) => {
    setFollowedUsers(prev => [...prev, user]);
  };

  // 移除关注用户
  const removeFollowedUser = (userId: string) => {
    setFollowedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // 更新筛选选项
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 更新搜索选项
  const updateSearchOptions = (newSearchOptions: Partial<SearchOptions>) => {
    setSearchOptions(prev => ({ ...prev, ...newSearchOptions }));
  };

  // 清除所有筛选
  const clearFilters = () => {
    setFilters({
      platforms: [],
      contentTypes: [],
      timeRange: 'all',
      sortBy: 'newest'
    });
    setSearchOptions({
      query: '',
      inContent: true,
      inAuthor: true,
      inTags: true
    });
  };

  return {
    // 数据
    platforms,
    feedItems: filteredFeedItems,
    followedUsers,
    loading,
    error,
    lastRefresh,
    
    // 筛选和搜索状态
    filters,
    searchOptions,
    
    // 操作函数
    refreshData,
    getPlatformInfo,
    addFollowedUser,
    removeFollowedUser,
    updateFilters,
    updateSearchOptions,
    clearFilters,
    
    // 统计信息
    totalItems: feedItems.length,
    filteredItemsCount: filteredFeedItems.length,
    platformsCount: platforms.length,
    followedUsersCount: followedUsers.length
  };
}
