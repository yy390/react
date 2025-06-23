import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
import { Article } from "../types";

interface ArticleContextType {
  articles: Article[];
  addArticle: (newArticle: Article) => void;
  updateArticle: (updatedArticle: Article) => void;
  deleteArticle: (articleId: number | string) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const saved = localStorage.getItem("articles");
        if (saved) {
          const data = JSON.parse(saved);
          setArticles(data);
          return;
        }
        
        const response = await fetch("/json/articles.json");
        const data = await response.json();
        setArticles(data);
        localStorage.setItem("articles", JSON.stringify(data));
      } catch (error) {
        console.log("加载文章失败:", error);
        setArticles([]);
      }
    };

    loadArticles();
  }, []);

  const saveToStorage = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
  };

  const addArticle = useCallback((newArticle: Article) => {
    const newArticles = [newArticle, ...articles];
    saveToStorage(newArticles);
  }, [articles]);

  const updateArticle = useCallback((updatedArticle: Article) => {
    const newArticles = articles.map(a => 
      a.id === updatedArticle.id ? updatedArticle : a
    );
    saveToStorage(newArticles);
  }, [articles]);
  
  const deleteArticle = useCallback((articleId: number | string) => {
    const newArticles = articles.filter(a => a.id !== articleId);
    saveToStorage(newArticles);
  }, [articles]);

  const value = useMemo(() => ({
    articles,
    addArticle,
    updateArticle,
    deleteArticle
  }), [articles, addArticle, updateArticle, deleteArticle]);

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};
export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticles必须在ArticleProvider内使用");
  }
  return context;
}; 