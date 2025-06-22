import React, { useMemo } from "react";
import { Row, Col } from "antd";
import { useSearch } from "../../utils/SearchContext";
import CarouselBanner from "../../components/Carousel";
import ArticleTabs from "../../components/ArticleTabs";
import RankList from "../../components/RankList";
import { useArticles } from "../../utils/ArticleContext";
import { Article } from "../../types";

const HomePage: React.FC = () => {
  const { searchKeyword } = useSearch();
  const { articles } = useArticles();

  const publicArticles = useMemo(() => {
    // 搜索时，不过滤 isPublic，以便可以搜索到自己的私密文章
    if (searchKeyword) {
      return articles;
    }
    return articles.filter((a: Article) => a.isPublic ?? true);
  }, [articles, searchKeyword]);

  const topArticlesForRank = useMemo(() => {
    return articles.filter((a: Article) => a.isPublic ?? true);
  }, [articles]);

  return (
    <div style={{ background: "#f7f8fa" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: '24px' }}>
        {/* 轮播图区域 */}
        <div style={{ marginBottom: 24 }}>
          <CarouselBanner />
        </div>
        <Row gutter={24} align="top">
          <Col span={16}>
            <div style={{ background: "#fff", borderRadius: 8, padding: '1px 20px 20px 20px' }}>
              <ArticleTabs searchKeyword={searchKeyword} articles={publicArticles} />
            </div>
          </Col>
          <Col span={8}>
            {/* 排行榜 */}
            <div style={{ background: "#fff", borderRadius: 8, padding: 20 }}>
              <RankList articles={topArticlesForRank} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
