import React, { useState } from "react";
import { Tabs, List, Tag } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Article } from "../types";
import { TECH_TAGS } from "../utils/constants";
import "./ArticleTabs.css";

interface ArticleTabsProps {
  searchKeyword: string;
  articles: Article[];
}

const ArticleTabs: React.FC<ArticleTabsProps> = ({ searchKeyword, articles }) => {
  const [activeKey, setActiveKey] = useState("hot");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const navigate = useNavigate();

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
      return [...filtered].sort((a, b) => b.views - a.views);
    } else {
      return [...filtered].sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
    }
  };

  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={key => { setActiveKey(key); setActiveTag(null); }}
        items={[{ key: "hot", label: "热门" }, { key: "new", label: "最新" }]}
        className="article-tabs"
      />
      <div className="tag-filter-section">
        {TECH_TAGS.map(tag => (
          <Tag.CheckableTag
            key={tag}
            checked={activeTag === tag}
            onChange={checked => setActiveTag(checked ? tag : null)}
            className="checkable-tag"
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
      <List
        itemLayout="vertical"
        dataSource={getSortedArticles()}
        className="article-list"
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`article-item ${!item.image ? 'no-image' : ''}`}
            onClick={() => navigate(`/article/${item.id}`)}
          >
            <div className="article-content">
              {item.image && 
                <img
                  className="article-image"
                  alt={item.title}
                  src={item.image}
                />
              }
              <div className="article-info">
                <h3 className="article-title">
                  {item.title}
                </h3>
                <p className="article-desc">
                  {item.desc}
                </p>
                <div className="article-meta">
                  <div className="article-meta-left">
                    <span>{item.author}</span>
                    <span className="article-meta-separator">|</span>
                    <span>{item.publishTime}</span>
                    <span className="article-meta-separator">|</span>
                    <span className="article-views">
                      <EyeOutlined className="article-views-icon" />
                      {item.views ?? 0}
                    </span>
                  </div>
                  <div className="article-tags">
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