export interface Article {
  id: number | string;
  title: string;
  desc: string;
  content?: string;
  author: string;
  publishTime: string;
  image: string;
  views: number;
  tags?: string[];
  isPublic?: boolean;
  likes?: number;
  commentsCount?: number;
}

export interface Comment {
  id: number | string;
  articleId: number | string;
  content: string;
  author: string;
  publishTime: string;
  likes: number;
  replies: Reply[];
}

export interface Reply {
  id: number | string;
  commentId: number | string;
  content: string;
  author: string;
  publishTime: string;
  likes: number;
  replyTo?: string; // 回复的用户名
}

export interface User {
  // ... existing code ...
} 