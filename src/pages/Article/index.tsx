import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Typography, Spin, message, Tag } from "antd";
import { useUser } from "../../utils/UserContext";
import { useArticles } from "../../utils/ArticleContext";
import LoginModal from "../../components/LoginModal";
import CommentList from "../../components/CommentList";
import { Article as ArticleType } from "../../types";

const { Title, Paragraph } = Typography;

const Article: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { articles, updateArticle } = useArticles();
  const [article, setArticle] = useState<ArticleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const hasIncrementedViews = useRef(false);

  useEffect(() => {
    if (!user.isLogin) {
      setLoginOpen(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    hasIncrementedViews.current = false;

    const findArticle = (articleList: ArticleType[]) => {
      const found = articleList.find((a) => String(a.id) === id);
      
      if (!found) {
        message.error("文章不存在");
        setArticle(null);
        setLoading(false);
        return;
      }
      
      if (!(found.isPublic ?? true) && found.author !== user.name) {
        message.error("无权访问此文章");
        setArticle(null);
        setLoading(false);
        return;
      }
      
      setArticle(found);
      
      if (!hasIncrementedViews.current) {
        const updated = { ...found, views: (found.views || 0) + 1 };
        updateArticle(updated);
        hasIncrementedViews.current = true;
      }
      
      setLoading(false);
    };

    if (articles.length > 0) {
      findArticle(articles);
    } else {
      const saved = localStorage.getItem("articles");
      if (saved) {
        const data = JSON.parse(saved);
        findArticle(data);
      } else {
        fetch("/json/articles.json")
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("articles", JSON.stringify(data));
            findArticle(data);
          })
          .catch(() => {
            message.error("加载文章失败");
            setLoading(false);
          });
      }
    }
  }, [id, user.isLogin]);

  if (!user.isLogin) {
    return <LoginModal open={loginOpen} onClose={() => navigate("/")} />;
  }
  
  if (loading) {
    return <Spin style={{ marginTop: 80 }} />;
  }
  
  if (!article) {
    return <div style={{ marginTop: 80 }}>文章不存在</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Button type="link" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        返回
      </Button>
      
      <Card>
        <Title level={2}>{article.title}</Title>
        
        <div style={{ color: "#888", marginBottom: 12 }}>
          作者：{article.author} | 发布时间：{article.publishTime} | 阅读：{article.views || 0}
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {article.tags.map(tag => (
              <Tag key={tag} color="blue" style={{ marginRight: 8 }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
        
        {article.image && (
          <img 
            src={article.image} 
            alt={article.title} 
            style={{ maxWidth: "100%", marginBottom: 16 }} 
          />
        )}
        
        <Paragraph>
          {article.content ?? article.desc}
        </Paragraph>
      </Card>
      
      <div style={{ marginTop: 32 }}>
        <CommentList articleId={article.id} />
      </div>
    </div>
  );
};

export default Article;
