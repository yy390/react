import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../utils/SearchContext";
import ArticleTabs from "../../components/ArticleTabs";
import RankList from "../../components/RankList";
import { useArticles } from "../../utils/ArticleContext";
import { Article } from "../../types";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { searchKeyword } = useSearch();
  const { articles } = useArticles();
  const [topArticles, setTopArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const savedArticles = localStorage.getItem("articles");
    if (savedArticles) {
      const articles = JSON.parse(savedArticles);
      const publicArticles = articles.filter((a: Article) => a.isPublic ?? true);
      const sorted = [...publicArticles].sort((a, b) => b.views - a.views);
      setTopArticles(sorted.slice(0, 4));
    } else {
      fetch("/json/articles.json")
        .then((res) => res.json())
        .then((articles: Article[]) => {
          const publicArticles = articles.filter((a: Article) => a.isPublic ?? true);
          const sorted = [...publicArticles].sort((a, b) => b.views - a.views);
          setTopArticles(sorted.slice(0, 4));
        });
    }
  }, []);

  useEffect(() => {
    if (topArticles.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topArticles.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [topArticles.length]);

  const publicArticles = useMemo(() => {
    if (searchKeyword) {
      return articles;
    } else {
      return articles.filter((a: Article) => a.isPublic ?? true);
    }
  }, [articles, searchKeyword]);

  const topArticlesForRank = useMemo(() => {
    return articles.filter((a: Article) => a.isPublic ?? true);
  }, [articles]);

  const handleSlideKeyDown = (e: React.KeyboardEvent, articleId: string | number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/article/${articleId}`);
    }
  };

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="carousel-section">
          <div className="custom-carousel-container">
            <div className="custom-carousel-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {topArticles.filter(item => item.image).map((item) => (
                <button
                  className="custom-carousel-slide"
                  key={item.id}
                  onClick={() => navigate(`/article/${item.id}`)}
                  onKeyDown={(e) => handleSlideKeyDown(e, item.id)}
                  style={{ border: 'none', background: 'none', padding: 0, width: '100%', display: 'block' }}
                >
                  <img
                    src={item.image ?? ''}
                    alt={item.title}
                    style={{ width: "100%", height: "360px", objectFit: "cover", cursor: 'pointer' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/800x360?text=Image+Not+Found";
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="custom-carousel-dots">
              {topArticles.filter(item => item.image).map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  className={`custom-carousel-dot ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="articles-section">
            <ArticleTabs searchKeyword={searchKeyword} articles={publicArticles} />
          </div>
          <div className="ranking-section">
            <RankList articles={topArticlesForRank} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
