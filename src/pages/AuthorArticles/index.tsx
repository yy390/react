import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../../utils/ArticleContext';
import { List, Tag, Avatar, Button } from 'antd';
import { EyeOutlined} from '@ant-design/icons';

const AuthorArticlesPage: React.FC = () => {
  const { authorName } = useParams<{ authorName: string }>();
  const { articles } = useArticles();
  const navigate = useNavigate();

  const authorArticles = useMemo(() => {
    if (!authorName) return [];
    return articles.filter(article => article.author === authorName && (article.isPublic ?? true));
  }, [articles, authorName]);

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 24px' }}>
        <Button type="link" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
            返回上一页
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Avatar size={64} style={{ marginRight: 16 }}>{authorName?.[0]}</Avatar>
            <h1 style={{ margin: 0 }}>{authorName} 的文章</h1>
        </div>

        <List
            itemLayout="vertical"
            dataSource={authorArticles}
            renderItem={(item) => (
                <List.Item
                    key={item.id}
                    style={{ background: '#fff', borderRadius: 8, marginBottom: 16, padding: 20, cursor: 'pointer' }}
                    onClick={() => navigate(`/article/${item.id}`)}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {item.image && 
                            <img
                            width={120}
                            style={{ height: 80, objectFit: 'cover', borderRadius: 4, marginRight: 16 }}
                            alt={item.title}
                            src={item.image}
                            />
                        }
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: 16, margin: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{item.title}</h3>
                            <p style={{ color: '#8a919f', margin: '8px 0', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{item.desc}</p>
                            <div style={{ marginTop: 8 }}>
                                <div style={{ color: '#8a919f', fontSize: 13, display: 'flex', alignItems: 'center', float: 'left' }}>
                                    <span>{item.author}</span>
                                    <span style={{ margin: '0 8px' }}>|</span>
                                    <span>{item.publishTime}</span>
                                    <span style={{ margin: '0 8px' }}>|</span>
                                    <span style={{ display: 'flex', alignItems: 'center' }}><EyeOutlined style={{ marginRight: 4 }} />{item.views ?? 0}</span>
                                </div>
                                <div style={{float: 'right'}}>
                                    {item.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    </div>
  );
};

export default AuthorArticlesPage; 