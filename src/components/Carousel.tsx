import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import { useNavigate } from "react-router-dom";

interface Article {
  id: number | string;
  image: string;
  title: string;
  desc: string;
  views: number;
  isPublic?: boolean;
}

const CarouselBanner: React.FC = () => {
  const navigate = useNavigate();
  const [topArticles, setTopArticles] = useState<Article[]>([]);

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

  return (
    <Carousel autoplay autoplaySpeed={5000} dots>
      {topArticles.map((item) => (
        <div key={item.id} onClick={() => navigate(`/article/${item.id}`)}>
          <img
            src={item.image}
            alt={item.title}
            style={{ width: "100%", height: "360px", objectFit: "cover", cursor: 'pointer' }}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBanner; 