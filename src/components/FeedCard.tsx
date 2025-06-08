import React from 'react';
import { ExternalLink, Heart, MessageCircle, Share2, Video, BookOpen, Twitter, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FeedItem, Platform } from '@/types';
import { formatTimeAgo, formatNumber } from '@/lib/api';

interface FeedCardProps {
  item: FeedItem;
  platform: Platform;
}

export function FeedCard({ item, platform }: FeedCardProps) {
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'tweet':
        return <Twitter className="w-4 h-4" />;
      case 'lifestyle':
        return <Camera className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getContentTypeText = (type: string) => {
    switch (type) {
      case 'video':
        return '视频';
      case 'article':
        return '文章';
      case 'tweet':
        return '推文';
      case 'lifestyle':
        return '生活';
      default:
        return '内容';
    }
  };

  const handleOpenOriginal = () => {
    window.open(item.originalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-all duration-200 border-l-4" 
          style={{ borderLeftColor: platform.color }}>
      <CardContent className="p-4 sm:p-6">
        {/* 头部信息 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* 平台图标 */}
            <div className="flex-shrink-0">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center p-1"
                style={{ backgroundColor: platform.backgroundColor }}
              >
                <img 
                  src={platform.icon} 
                  alt={platform.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={item.author.avatar} alt={item.author.name} />
                <AvatarFallback>
                  {item.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {item.author.name}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  @{item.author.username}
                </div>
              </div>
            </div>

            {/* 时间和类型 */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm text-gray-500 mb-1">
                {formatTimeAgo(item.timestamp)}
              </div>
              <Badge variant="secondary" className="text-xs">
                <span className="mr-1">{getContentTypeIcon(item.type)}</span>
                {getContentTypeText(item.type)}
              </Badge>
            </div>
          </div>
        </div>

        {/* 内容摘要 */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed line-clamp-3">
            {item.summary}
          </p>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* 左侧：统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(item.stats.likes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{formatNumber(item.stats.comments)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-4 h-4" />
              <span>{formatNumber(item.stats.shares)}</span>
            </div>
          </div>

          {/* 右侧：查看原文按钮 */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleOpenOriginal}
            className="flex items-center space-x-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span>查看原文</span>
          </Button>
        </div>

        {/* 平台标识 */}
        <div className="absolute top-4 right-4 opacity-60">
          <Badge 
            className="text-xs font-medium"
            style={{ 
              backgroundColor: platform.backgroundColor,
              color: platform.color,
              border: `1px solid ${platform.color}20`
            }}
          >
            {platform.name}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// 加载状态的骨架屏组件
export function FeedCardSkeleton() {
  return (
    <Card className="mb-4">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex items-center space-x-2 flex-1">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
}
