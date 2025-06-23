import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';
import { useArticles } from '../../utils/ArticleContext';
import { useComments } from '../../utils/CommentContext';
import { Article, Comment } from '../../types';
import { Button, Card, Avatar, Tag, message, Divider, Form, Input, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, LikeOutlined, LikeFilled } from '@ant-design/icons';
import './ArticlePage.css';

const { TextArea } = Input;

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { articles, updateArticle, deleteArticle } = useArticles();
  const { getCommentsByArticleId, addComment } = useComments();
  const [article, setArticle] = useState<Article | null>(null);
  const [articleComments, setArticleComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm] = Form.useForm();
  
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchArticleData = () => {
      if (id) {
        const foundArticle = articles.find(a => a.id.toString() === id);
        if (foundArticle) {
          if (!foundArticle.isPublic && foundArticle.author !== user.name) {
            message.error("这是一篇私密文章，您没有权限查看");
            navigate('/');
            return;
          }
          setArticle(foundArticle);
          const viewedArticles = JSON.parse(sessionStorage.getItem('viewed_articles') ?? '[]');
          if (!viewedArticles.includes(foundArticle.id)) {
            const updatedArticle = { ...foundArticle, views: (foundArticle.views || 0) + 1 };
            updateArticle(updatedArticle);
            setArticle(updatedArticle);
            sessionStorage.setItem('viewed_articles', JSON.stringify([...viewedArticles, foundArticle.id]));
          }
          
          const likedArticles = JSON.parse(localStorage.getItem(`liked_by_${user.name}`) ?? '[]');
          setLiked(likedArticles.includes(foundArticle.id));

        } else {
          message.error("文章不存在！");
          navigate('/');
        }
      }
      setLoading(false);
    };

    if(articles.length > 0) {
      fetchArticleData();
    }
  }, [id, user.name, user.isLogin, articles, navigate, updateArticle]);

  useEffect(() => {
    if (id) {
        const commentsForArticle = getCommentsByArticleId(id);
        setArticleComments(commentsForArticle.sort((a: Comment, b: Comment) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()));
    }
  }, [id, getCommentsByArticleId]);


  const handleLike = () => {
    if (!user.isLogin || !article) return;

    const newLikedState = !liked;
    const currentLikes = article.likes ?? 0;
    const newLikes = newLikedState ? currentLikes + 1 : currentLikes - 1;

    const updatedArticle = { ...article, likes: newLikes };
    updateArticle(updatedArticle);
    setArticle(updatedArticle);
    setLiked(newLikedState);
    
    const likedArticles = JSON.parse(localStorage.getItem(`liked_by_${user.name}`) ?? '[]');
    if(newLikedState) {
        localStorage.setItem(`liked_by_${user.name}`, JSON.stringify([...likedArticles, article.id]));
    } else {
        localStorage.setItem(`liked_by_${user.name}`, JSON.stringify(likedArticles.filter((likedId: number | string) => likedId !== article.id)));
    }
  };

  const handleDelete = () => {
    if (article) {
      deleteArticle(article.id);
      message.success("文章删除成功！");
      navigate('/my-articles');
    }
  };

  const handleCommentSubmit = (values: { content: string }) => {
    if (!user.isLogin) {
      message.error("请先登录再评论");
      return;
    }
    if (id && user.name) {
      const newComment: Omit<Comment, 'likes' | 'replies'> = {
        id: Date.now(),
        articleId: id,
        author: user.name,
        content: values.content,
        publishTime: new Date().toISOString(),
      };
      addComment(id, { ...newComment, likes: 0, replies: [] });
      commentForm.resetFields();
      message.success("评论成功！");
    }
  };


  if (loading && articles.length === 0) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>加载中...</div>;
  }

  if (!article) {
    return <div style={{ textAlign: 'center', marginTop: 50 }}>文章加载失败或不存在。</div>;
  }

  return (
    <div className="article-page-container">
      <Card>
        <div className="article-header">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="meta-item author-meta">
                <Avatar icon={<UserOutlined />} size="small" />
                <Link to={`/author/${article.author}`}>{article.author}</Link>
            </span>
            <span className="meta-item">发布于 {article.publishTime}</span>
            <span className="meta-item">阅读量 {article.views}</span>
            {!article.isPublic && <Tag color="orange">私密</Tag>}
          </div>
          <div className="article-tags">
            {article.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </div>
        <Divider />
        
        {article.image && <img src={article.image} alt={article.title} className="article-cover-image" />}
        
        <div className="markdown-body">
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{article.content}</pre>
        </div>
      
        <Divider />

        <div className="article-actions">
            <div>
                <Button 
                    icon={liked ? <LikeFilled style={{color: '#1890ff'}}/> : <LikeOutlined />} 
                    onClick={handleLike}
                    disabled={!user.isLogin}
                >
                    {article.likes ?? 0}
                </Button>
            </div>
            {user.name === article.author && (
                <div className="author-actions">
                    <Button icon={<EditOutlined />} onClick={() => navigate(`/edit-article/${article.id}`)}>编辑</Button>
                    <Popconfirm
                      title="删除文章"
                      description="确定要删除这篇文章吗？此操作不可撤销。"
                      onConfirm={handleDelete}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button icon={<DeleteOutlined />} danger>删除</Button>
                    </Popconfirm>
                </div>
            )}
        </div>
      </Card>

      <Card title="评论区" className="comment-section">
        {user.isLogin && (
            <Form form={commentForm} onFinish={handleCommentSubmit} className="comment-form">
                <Form.Item name="content" rules={[{ required: true, message: '评论内容不能为空' }]}>
                    <TextArea rows={4} placeholder="发表你的看法..."/>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">发表评论</Button>
                </Form.Item>
            </Form>
        )}
         {articleComments.length > 0 ? (
          articleComments.map((comment: Comment) => (
            <div key={comment.id} className="comment-item">
              <Avatar icon={<UserOutlined />} className="comment-avatar" />
              <div className="comment-content-wrapper">
                <div className="comment-meta">
                  <strong>{comment.author}</strong>
                  <span className="comment-time">{new Date(comment.publishTime).toLocaleString()}</span>
                </div>
                <p className="comment-text">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">暂无评论，快来抢沙发吧！</div>
        )}
      </Card>
    </div>
  );
};

export default ArticlePage;
