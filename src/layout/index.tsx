/**
 * TODO: 布局
 */
import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./index.css";
import Navbar from "../components/Navbar";
import { useSearch } from "../utils/SearchContext";
import { usePublish } from "../utils/PublishContext";
import PublishModal from "../components/PublishModal";
import { useArticles } from "../utils/ArticleContext";

const { Header, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 0,
  lineHeight: "64px",
  backgroundColor: "#000000",
};

const contentStyle: React.CSSProperties = {
  backgroundColor: '#f7f8fa',
};

const layoutStyle = {
  minHeight: '100vh',
};

const LayoutPage: React.FC = () => {
  const { setSearchKeyword } = useSearch();
  const { isPublishOpen, setIsPublishOpen } = usePublish();
  const { addArticle } = useArticles();

  const handlePublishSuccess = (newArticle: any) => {
    addArticle(newArticle);
    setIsPublishOpen(false); // 关闭弹窗
  }

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Navbar onSearch={setSearchKeyword} />
      </Header>
      <Content style={contentStyle}>
        <Outlet />
      </Content>
      <PublishModal 
        open={isPublishOpen} 
        onClose={() => setIsPublishOpen(false)} 
        onPublish={handlePublishSuccess} 
      />
    </Layout>
  );
};

export default LayoutPage;
