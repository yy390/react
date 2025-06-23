import React, { useMemo } from "react";
import { List, Button, message, Popconfirm, Tag } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { useUser } from "../../utils/UserContext";
import { Article } from "../../types";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../../utils/ArticleContext";

const MyArticles: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { articles, deleteArticle } = useArticles();

  const myArticles = useMemo(() => {
    return articles.filter(a => a.author === user.name);
  }, [articles, user.name]);

  const handleDelete = (id: number | string) => {
    const articleToDelete = articles.find(a => a.id === id);
    if (!articleToDelete) {
      message.error("文章不存在！");
      return;
    }
    if (articleToDelete.author !== user.name) {
      message.error("您没有权限删除别人的文章！");
      return;
    }
    deleteArticle(id);
    message.success("文章删除成功！");
  };

  // 编辑文章
  const handleEdit = (article: Article) => {
    if (article.author !== user.name) {
      message.error("您没有权限编辑别人的文章！");
      return;
    }
    navigate(`/edit/${article.id}`);
  };

  if (!user.isLogin) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        请先 <Button type="link" onClick={() => navigate('/')}>登录</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 900, width: '100%', margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ marginBottom: 24 }}>我的文章</h1>
        <List
          style={{ flex: 1 }}
          itemLayout="vertical"
          dataSource={myArticles}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button type="link" onClick={() => handleEdit(item)}>修改</Button>,
                <Popconfirm
                  title="确定删除这篇文章吗？"
                  onConfirm={() => handleDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" danger>删除</Button>
                </Popconfirm>,
              ]}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <a onClick={() => navigate(`/article/${item.id}`)} style={{ 
                    fontSize: 16, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.88)', 
                    marginRight: 8, cursor: 'pointer', maxWidth: '300px', overflow: 'hidden',
                     textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', flex: 1 
                     }}>
                    {item.title}
                  </a>
                  <Tag color={item.isPublic ?? true ? 'green' : 'orange'}>
                    {item.isPublic ?? true ? '公开' : '私密'}
                  </Tag>
                </div>
                <p style={{ color: '#8a919f', margin: '8px 0', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {item.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#8a919f', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                    <span>{item.author}</span>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <span>{item.publishTime}</span>
                    <span style={{ margin: '0 8px' }}>|</span>
                    <span style={{ display: 'flex', alignItems: 'center' }}><EyeOutlined style={{ marginRight: 4 }} />{item.views ?? 0}</span>
                  </div>
                  <div>
                    {item.tags?.map(tag => <Tag key={tag}>{tag}</Tag>)}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default MyArticles; 