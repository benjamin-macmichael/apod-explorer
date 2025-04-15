import React, { useEffect, useReducer, useState } from "react";
import { Article, NewsApiResponse } from "../../types/article";
import "./NewsCardsAll.css";

// Function URL for News API
const LAMBDA_FUNCTION_URL = "https://q27rcizedi47qoj266epovk53i0hiawa.lambda-url.us-east-1.on.aws/";

// Define actions for reducer
type Action =
  | { type: "LOAD_NEWS"; payload: { articles: Article[]; page: number } }
  | { type: "ADD_NEWS"; payload: Article[] }
  | { type: "NEXT_PAGE" };

// Reducer function to manage news state
const newsReducer = (
  state: { articles: Article[]; page: number },
  action: Action
) => {
  switch (action.type) {
    case "LOAD_NEWS":
      return action.payload;
    case "ADD_NEWS":
      const newArticles = action.payload.filter(
        (article) => !state.articles.some((a) => a.url === article.url)
      );
      const updatedState = {
        ...state,
        articles: [...state.articles, ...newArticles],
      };
      localStorage.setItem("newsData", JSON.stringify(updatedState)); // Save to localStorage
      return updatedState;
    case "NEXT_PAGE":
      const nextState = { ...state, page: state.page + 1 };
      localStorage.setItem("newsData", JSON.stringify(nextState)); // Save page number too
      return nextState;
    default:
      return state;
  }
};

const NASA_News_All = () => {
  const [loading, setLoading] = useState(true);

  // Load saved news from localStorage or start fresh
  const savedData = localStorage.getItem("newsData");
  const initialState = savedData
    ? JSON.parse(savedData)
    : { articles: [], page: 1 };

  const [state, dispatch] = useReducer(newsReducer, initialState);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
    
      try {
        const res = await fetch(`${LAMBDA_FUNCTION_URL}?pageSize=12&page=${state.page}`);
        const data: NewsApiResponse = await res.json();
    
        const validArticles = data.articles.filter(
          (article) => article.urlToImage
        );
    
        dispatch({ type: "ADD_NEWS", payload: validArticles });
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchNews();
  }, [state.page]);

  const loadMoreArticles = () => {
    dispatch({ type: "NEXT_PAGE" });
  };

  return (
    <div className="news-container">
      {loading && state.articles.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="news-cards">
            {state.articles.map((article, index) => (
              <div key={index} className="news-card">
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={article.urlToImage || "https://via.placeholder.com/150"}
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
          <button onClick={loadMoreArticles} className="load-more">
            Load More
          </button>
        </>
      )}
    </div>
  );
};

export default NASA_News_All;
