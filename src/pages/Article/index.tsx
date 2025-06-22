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
    hasIncrementedViews.current = false; // 重置标记

    const findArticle = (articleList: ArticleType[]) => {
      const found = articleList.find((a) => String(a.id) === id);
      if (!found) {
        message.error("未找到该文章");
        setArticle(null);
      } else if (!(found.isPublic ?? true) && found.author !== user.name) {
        message.error("该文章为私密内容，您无权访问");
        setArticle(null);
      } else {
        setArticle(found);
        // 只在第一次找到文章时增加阅读量
        if (!hasIncrementedViews.current) {
          const updatedArticle = { ...found, views: found.views + 1 };
          updateArticle(updatedArticle);
          hasIncrementedViews.current = true;
        }
      }
      setLoading(false);
    };

    if (articles.length > 0) {
      findArticle(articles);
    } else {
      // 如果 articles 为空，从 localStorage 或 JSON 文件加载
      const savedArticles = localStorage.getItem("articles");
      let articleList: ArticleType[] = [];

      if (savedArticles) {
        articleList = JSON.parse(savedArticles);
        findArticle(articleList);
      } else {
        fetch("/json/articles.json")
          .then((res) => res.json())
          .then((data: ArticleType[]) => {
            localStorage.setItem("articles", JSON.stringify(data));
            findArticle(data);
          });
      }
    }
  }, [id, user.isLogin]); // 移除 articles 和 updateArticle 依赖

  if (!user.isLogin) {
    return <LoginModal open={loginOpen} onClose={() => navigate("/")} />;
  }
  if (loading) return <Spin style={{ marginTop: 80 }} />;
  if (!article) return <div style={{ marginTop: 80 }}>未找到该文章</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <Button type="link" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        返回上一页
      </Button>
      <Card>
        <Title level={2}>{article.title}</Title>
        <div style={{ color: "#888", marginBottom: 12 }}>
          作者：{article.author} &nbsp;|&nbsp; 发布时间：{article.publishTime} &nbsp;|&nbsp; 阅读量：{typeof article.views === 'number' ? article.views : 0}
        </div>
        {article.tags && article.tags.length > 0 && (
          <div style={{ textAlign: 'right', marginBottom: 12 }}>
            {article.tags.map(tag => (
              <Tag key={tag} color="green" style={{ marginLeft: 8 }}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
        {article.image && (
          <img src={article.image} alt={article.title} style={{ maxWidth: "100%", marginBottom: 16 }} />
        )}
        <Paragraph>
          {article.content || article.desc}
        </Paragraph>
      </Card>
      
      {/* 评论区 */}
      <div style={{ marginTop: 32 }}>
        <CommentList articleId={article.id} />
      </div>
    </div>
  );
};

export default Article;
