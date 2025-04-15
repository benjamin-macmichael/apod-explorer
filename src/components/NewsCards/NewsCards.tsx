import React, { useEffect, useState } from 'react';
import { Article } from "../../types/article";
import "./NewsCards.css";

// Function URL for News API
const LAMBDA_FUNCTION_URL = "https://q27rcizedi47qoj266epovk53i0hiawa.lambda-url.us-east-1.on.aws/";

const NASA_News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const savedArticles = localStorage.getItem("nasaNews");
      if (savedArticles) {
        setArticles(JSON.parse(savedArticles));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(LAMBDA_FUNCTION_URL);
        if (!response.ok) throw new Error("Failed to fetch news");

        const data = await response.json();
        setArticles(data.articles);
        localStorage.setItem("nasaNews", JSON.stringify(data.articles));
      } catch (error) {
        console.error("Error fetching NASA news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="news-cards">
          {articles.map((article, index) => (
            <div key={index} className="news-card">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={article.urlToImage || 'https://via.placeholder.com/150'}
                  alt={article.title}
                  className="news-image"
                />
                <div className="news-content">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NASA_News;
