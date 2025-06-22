import React, { createContext, useState, useContext, useEffect } from "react";
import { Comment, Reply } from "../types";

interface CommentContextType {
  comments: { [articleId: string]: Comment[] };
  addComment: (articleId: string | number, comment: Comment) => void;
  addReply: (articleId: string | number, commentId: string | number, reply: Reply) => void;
  likeComment: (articleId: string | number, commentId: string | number) => void;
  likeReply: (articleId: string | number, commentId: string | number, replyId: string | number) => void;
  getCommentsByArticleId: (articleId: string | number) => Comment[];
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<{ [articleId: string]: Comment[] }>({});

  // 从 localStorage 加载评论数据
  useEffect(() => {
    const savedComments = localStorage.getItem("allComments");
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error("Error loading comments:", error);
        setComments({});
      }
    }
  }, []);

  // 保存评论到 localStorage
  const saveComments = (newComments: { [articleId: string]: Comment[] }) => {
    setComments(newComments);
    localStorage.setItem("allComments", JSON.stringify(newComments));
  };

  // 添加评论
  const addComment = (articleId: string | number, comment: Comment) => {
    const articleIdStr = articleId.toString();
    const currentComments = comments[articleIdStr] || [];
    const updatedComments = {
      ...comments,
      [articleIdStr]: [comment, ...currentComments]
    };
    saveComments(updatedComments);
  };

  // 添加回复
  const addReply = (articleId: string | number, commentId: string | number, reply: Reply) => {
    const articleIdStr = articleId.toString();
    const currentComments = comments[articleIdStr] || [];
    const updatedComments = currentComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    });
    
    const newComments = {
      ...comments,
      [articleIdStr]: updatedComments
    };
    saveComments(newComments);
  };

  // 点赞评论
  const likeComment = (articleId: string | number, commentId: string | number) => {
    const articleIdStr = articleId.toString();
    const currentComments = comments[articleIdStr] || [];
    const updatedComments = currentComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    
    const newComments = {
      ...comments,
      [articleIdStr]: updatedComments
    };
    saveComments(newComments);
  };

  // 点赞回复
  const likeReply = (articleId: string | number, commentId: string | number, replyId: string | number) => {
    const articleIdStr = articleId.toString();
    const currentComments = comments[articleIdStr] || [];
    const updatedComments = currentComments.map(comment => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map(reply => {
          if (reply.id === replyId) {
            return { ...reply, likes: reply.likes + 1 };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    
    const newComments = {
      ...comments,
      [articleIdStr]: updatedComments
    };
    saveComments(newComments);
  };

  // 获取指定文章的评论
  const getCommentsByArticleId = (articleId: string | number): Comment[] => {
    const articleIdStr = articleId.toString();
    return comments[articleIdStr] || [];
  };

  return (
    <CommentContext.Provider value={{
      comments,
      addComment,
      addReply,
      likeComment,
      likeReply,
      getCommentsByArticleId
    }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
}; 