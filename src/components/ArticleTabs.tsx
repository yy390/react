import React, { useState } from "react";
import { Tabs, List, Tag } from "antd";
import { EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Article } from "../types";
import { TECH_TAGS } from "../utils/constants";

interface ArticleTabsProps {
  searchKeyword: string;
  articles: Article[];
}

const ArticleTabs: React.FC<ArticleTabsProps> = ({ searchKeyword, articles }) => {
  const [activeKey, setActiveKey] = useState("hot");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const navigate = useNavigate();

  // 模拟热门/最新排序和标签筛选
  const getSortedArticles = () => {
    const lowercasedKeyword = searchKeyword.toLowerCase();
    let filtered = articles.filter(
      (a) =>
        (a.title.toLowerCase().includes(lowercasedKeyword) ||
          a.desc.toLowerCase().includes(lowercasedKeyword) ||
          a.author.toLowerCase().includes(lowercasedKeyword)) &&
        (!activeTag || (a.tags ? a.tags.includes(activeTag) : a.title.toLowerCase().includes(activeTag.toLowerCase()) || a.desc.toLowerCase().includes(activeTag.toLowerCase())))
    );
    if (activeKey === "hot") {
      // 按 views 降序排（热门）
      return [...filtered].sort((a, b) => b.views - a.views);
    } else {
      // 按 publishTime 降序排（最新）
      return [...filtered].sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
    }
  };

  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={key => { setActiveKey(key); setActiveTag(null); }}
        items={[{ key: "hot", label: "热门" }, { key: "new", label: "最新" }]}
        style={{ marginBottom: 8 }}
      />
      <div style={{ marginBottom: 12 }}>
        {TECH_TAGS.map(tag => (
          <Tag.CheckableTag
            key={tag}
            checked={activeTag === tag}
            onChange={checked => setActiveTag(checked ? tag : null)}
            style={{ marginBottom: 4 }}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
      <List
        itemLayout="vertical"
        dataSource={getSortedArticles()}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            style={{ padding: '16px 0', cursor: 'pointer' }}
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
    </>
  );
};

export default ArticleTabs; 