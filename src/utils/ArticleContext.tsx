import React, { createContext, useState, useContext, useEffect } from "react";
import { Article } from "../types";

interface ArticleContextType {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  updateArticle: (updatedArticle: Article) => void;
  deleteArticle: (articleId: number | string) => void;
  addArticle: (newArticle: Article) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  // 验证和修复文章数据
  const validateAndFixArticles = (data: any[]): Article[] => {
    return data.map(article => ({
      ...article,
      views: typeof article.views === 'number' ? article.views : 0,
      isPublic: article.isPublic ?? true,
      tags: article.tags || [],
      type: article.type || "技术"
    }));
  };

  useEffect(() => {
    const savedArticles = localStorage.getItem("articles");
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        const validatedArticles = validateAndFixArticles(parsedArticles);
        setArticles(validatedArticles);
        // 如果数据被修复，更新 localStorage
        if (JSON.stringify(parsedArticles) !== JSON.stringify(validatedArticles)) {
          localStorage.setItem("articles", JSON.stringify(validatedArticles));
        }
      } catch (error) {
        console.error("Error parsing saved articles:", error);
        // 如果解析失败，从 JSON 文件重新加载
        loadFromJson();
      }
    } else {
      loadFromJson();
    }
  }, []);

  const loadFromJson = () => {
    fetch("/json/articles.json")
      .then(res => res.json())
      .then((data: Article[]) => {
        const validatedArticles = validateAndFixArticles(data);
        setArticles(validatedArticles);
        localStorage.setItem("articles", JSON.stringify(validatedArticles));
      })
      .catch(error => {
        console.error("Error loading articles from JSON:", error);
        setArticles([]);
      });
  };

  const updateLocalStorage = (newArticles: Article[]) => {
    setArticles(newArticles);
    localStorage.setItem("articles", JSON.stringify(newArticles));
  };

  const addArticle = (newArticle: Article) => {
    const newArticles = [newArticle, ...articles];
    updateLocalStorage(newArticles);
  };

  const updateArticle = (updatedArticle: Article) => {
    const newArticles = articles.map(a => (a.id === updatedArticle.id ? updatedArticle : a));
    updateLocalStorage(newArticles);
  };
  
  const deleteArticle = (articleId: number | string) => {
    const newArticles = articles.filter(a => a.id !== articleId);
    updateLocalStorage(newArticles);
  };

  return (
    <ArticleContext.Provider value={{ articles, setArticles, addArticle, updateArticle, deleteArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }
  return context;
}; 