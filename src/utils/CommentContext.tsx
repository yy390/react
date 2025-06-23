import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
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

  useEffect(() => {
    const saved = localStorage.getItem("allComments");
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (error) {
        console.log("加载评论失败:", error);
        setComments({});
      }
    }
  }, []);

  const saveComments = (newComments: { [articleId: string]: Comment[] }) => {
    setComments(newComments);
    localStorage.setItem("allComments", JSON.stringify(newComments));
  };

  const addComment = useCallback((articleId: string | number, comment: Comment) => {
    const id = articleId.toString();
    const current = comments[id] || [];
    const updated = {
      ...comments,
      [id]: [comment, ...current]
    };
    saveComments(updated);
  }, [comments]);

  const addReply = useCallback((articleId: string | number, commentId: string | number, reply: Reply) => {
    const id = articleId.toString();
    const current = comments[id] || [];
    const updated = current.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, reply] };
      }
      return comment;
    });
    
    saveComments({
      ...comments,
      [id]: updated
    });
  }, [comments]);

  const likeComment = useCallback((articleId: string | number, commentId: string | number) => {
    const id = articleId.toString();
    const current = comments[id] || [];
    const updated = current.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    
    saveComments({
      ...comments,
      [id]: updated
    });
  }, [comments]);

  const likeReply = useCallback((articleId: string | number, commentId: string | number, replyId: string | number) => {
    const id = articleId.toString();
    const current = comments[id] || [];
    const updated = current.map(comment => {
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
    
    saveComments({
      ...comments,
      [id]: updated
    });
  }, [comments]);

  const getCommentsByArticleId = useCallback((articleId: string | number): Comment[] => {
    const id = articleId.toString();
    return comments[id] || [];
  }, [comments]);

  const value = useMemo(() => ({
    comments,
    addComment,
    addReply,
    likeComment,
    likeReply,
    getCommentsByArticleId
  }), [comments, addComment, addReply, likeComment, likeReply, getCommentsByArticleId]);

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComments必须在CommentProvider内使用");
  }
  return context;
}; 