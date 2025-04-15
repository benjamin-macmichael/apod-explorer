import { useEffect, useState, useReducer, useRef, useTransition } from "react";
import { NASA_API_KEY } from "../../api/nasaApi";
import { ApodData } from "../../types/apod";
import "./Apod.css";
import NewsCards from "../NewsCards/NewsCards";

// Define actions for reducer
type Action =
  | { type: "ADD_APOD"; payload: ApodData }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "LOAD_HISTORY"; payload: { history: ApodData[]; currentIndex: number } };

const apodReducer = (state: { history: ApodData[]; currentIndex: number }, action: Action) => {
  switch (action.type) {
    case "ADD_APOD":
      if (state.history.length > 0 && state.history[state.currentIndex]?.url === action.payload.url) {
        return state; // Skip duplicate
      }
      const newHistory = [...state.history.slice(0, state.currentIndex + 1), action.payload];
      const newState = {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      };
      localStorage.setItem("apodHistory", JSON.stringify(newState)); // Save to localStorage
      return newState;
    case "GO_BACK":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };
    case "GO_FORWARD":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.history.length - 1),
      };
    case "LOAD_HISTORY":
      return action.payload;
    default:
      return state;
  }
};

const Apod = () => {
  const [error, setError] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const apodRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem("apodHistory");
    if (savedData) {
      dispatch({ type: "LOAD_HISTORY", payload: JSON.parse(savedData) });
    } else {
      fetchApod(false); // Load APOD for today if no cache exists
    }
  }, []);

  const [state, dispatch] = useReducer(apodReducer, { history: [], currentIndex: -1 });

  const fetchApod = async (random = false) => {
    setIsFading(true);
    try {
      const dateParam = random ? `&date=${getRandomDate()}` : "";
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}${dateParam}`
      );

      if (!response.ok) throw new Error("Failed to fetch APOD");

      const data: ApodData = await response.json();

      setTimeout(() => {
        dispatch({ type: "ADD_APOD", payload: data });
        setIsFading(false);
      }, 500);
    } catch (err) {
      setError("Something went wrong!");
      console.error(err);
    }
  };

  const getRandomDate = () => {
    const start = new Date(1995, 5, 16);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split("T")[0];
  };

  const scrollToApod = () => {
    if (apodRef.current) {
      apodRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (error) return <p>{error}</p>;
  if (state.history.length === 0)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );

  const apod = state.history[state.currentIndex];

  return (
    <>
      <div className="video-container">
        <video className="space-video" autoPlay loop muted playsInline>
          <source src={`${process.env.PUBLIC_URL}/mars.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay">
          <h1>
            Astronomy Picture <br /> of the Day
          </h1>
          <p>Explore the wonders of space, one day at a time.</p>
        </div>
        <div className="video-overlay-card-container">
          <div className="video-overlay-card">
            <h2>Today's APOD</h2>
            <p>Click below to see today's APOD</p>
            <button
              onClick={() => {
                fetchApod(false);
                scrollToApod();
              }}
            >
              🌟 Today's APOD
            </button>
          </div>
          <div className="video-overlay-card">
            <h2>Random APOD</h2>
            <p>Click below to see a surprise Astronomy Picture of the Day.</p>
            <button
              onClick={() => {
                startTransition(() => {
                  fetchApod(true);
                  scrollToApod();
                });
              }}
            >
              🔀 Random APOD
            </button>
          </div>
        </div>
      </div>

      <NewsCards />

      <div className="apod-container" ref={apodRef}>
        <div className={`apod-content ${isPending ? "fade-in" : ""}`}>
          <div className="Apod-header">{apod?.title}</div>
          {apod?.media_type === "image" ? (
            <img src={apod?.url} alt={apod?.title} className="apod-image" />
          ) : (
            <iframe
              title={apod?.title}
              src={apod?.url}
              className="apod-iframe"
              allowFullScreen
            />
          )}
          <div className="Apod-description">
            <p>{apod?.explanation}</p>
          </div>
          <div className="apod-controls">
            <button
              onClick={() => {
                if (state.currentIndex > 0) {
                  setIsFading(true);
                  setTimeout(() => {
                    dispatch({ type: "GO_BACK" });
                    setIsFading(false);
                  }, 500);
                }
              }}
              disabled={state.currentIndex <= 0}
            >
              ⬅️ Back
            </button>

            <button
              onClick={() => {
                startTransition(() => {
                  fetchApod(true);
                  scrollToApod();
                });
              }}
            >
              🔀 Random APOD
            </button>

            <button
              onClick={() => {
                if (state.currentIndex < state.history.length - 1) {
                  setIsFading(true);
                  setTimeout(() => {
                    dispatch({ type: "GO_FORWARD" });
                    setIsFading(false);
                  }, 500);
                }
              }}
              disabled={state.currentIndex >= state.history.length - 1}
            >
              Forward ➡️
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Apod;
