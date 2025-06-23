import React, { useState } from "react";
import { Tabs, List, Avatar, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { Article } from "../types";
import { useSearch } from "../utils/SearchContext";

interface RankItem {
  name: string;
  score: number;
  id?: number | string;
}
interface RankTab {
  tab: string;
  list: RankItem[];
}
interface RankListProps {
  articles: Article[];
}

const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const RankList: React.FC<RankListProps> = ({ articles }) => {
  const [activeKey, setActiveKey] = useState("1");
  const navigate = useNavigate();
  useSearch();

  const calculateRanks = (): RankTab[] => {
    const sortedByViews = [...articles].sort((a, b) => b.views - a.views);
    const sortedByLikes = [...articles].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));

    // 作者榜计算
    const authorViews: { [key: string]: number } = {};
    articles.forEach(a => {
      authorViews[a.author] = (authorViews[a.author] || 0) + a.views;
    });
    const authorRank = Object.entries(authorViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, score]) => ({ name, score }));

    // 文章榜计算
    const articleRank = [...articles]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(a => ({ name: a.title, score: a.views, id: a.id }));

    return [
      { tab: "作者榜", list: authorRank },
      { tab: "文章榜", list: articleRank },
    ];
  };
  
  const data = calculateRanks();

  const handleClick = (item: RankItem) => {
    if (item.id) {
      navigate(`/article/${item.id}`);
      return;
    }
    navigate(`/author/${item.name}`);
  };

  return (
    <>
      <Tabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={data.map((tab, idx) => ({ key: String(idx), label: tab.tab }))}
        style={{ marginBottom: 8 }}
      />
      <List
        size="small"
        dataSource={data[Number(activeKey)]?.list || []}
        renderItem={(item, idx) => (
          <List.Item
            style={{
              background: idx < 3 ? "#f9f7e8" : "#fff",
              borderRadius: 8,
              marginBottom: 8,
              boxShadow: idx < 3 ? "0 2px 8px #ffe" : "0 1px 4px #eee",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "box-shadow 0.2s"
            }}
            onClick={() => handleClick(item)}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px #e0e0e0")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = idx < 3 ? "0 2px 8px #ffe" : "0 1px 4px #eee")}
          >
            <span style={{
              display: "inline-block",
              width: 24,
              textAlign: "center",
              fontWeight: 700,
              color: idx < 3 ? rankColors[idx] : "#888"
            }}>
              {idx + 1}
            </span>
            <Avatar style={{ marginRight: 8, background: idx < 3 ? rankColors[idx] : undefined }}>{item.name[0]}</Avatar>
            <span style={{ flex: 1, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, display: 'block' }}>{item.name}</span>
            <Tag color={idx < 3 ? rankColors[idx] : "#eee"} style={{ fontSize: 15, padding: "2px 12px" }}>{item.score}</Tag>
          </List.Item>
        )}
      />
    </>
  );
};

export default RankList; 