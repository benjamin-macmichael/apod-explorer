import { useState, useEffect, useTransition } from "react";
import { NASA_API_KEY } from "../../api/nasaApi";
import { ApodData } from "../../types/apod";
import "./SearchApod.css";

const SearchApod = () => {
  const [date, setDate] = useState<string>('');
  const [apod, setApod] = useState<ApodData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedApod = localStorage.getItem("savedApod");
    if (savedApod) {
      const parsedApod = JSON.parse(savedApod);
      setApod(parsedApod);
      setDate(parsedApod.date);
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const fetchApodByDate = async () => {
    const storedApod = localStorage.getItem(`apod_${date}`);
    if (storedApod) {
      const parsed = JSON.parse(storedApod);
      startTransition(() => {
        setApod(parsed);
        setError(null);
      });
      return;
    }

    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`
      );
      if (!response.ok) throw new Error("Failed to fetch APOD");

      const data: ApodData = await response.json();

      localStorage.setItem(`apod_${date}`, JSON.stringify(data));
      localStorage.setItem("savedApod", JSON.stringify(data));

      startTransition(() => {
        setApod(data);
        setError(null);
      });
    } catch (err) {
      console.error(err);
      startTransition(() => {
        setError("Something went wrong!");
      });
    }
  };

  return (
    <div className="search-apod">
      <h1>Search for an APOD by Date</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchApodByDate();
        }}
        className="search-form"
      >
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          max={new Date().toISOString().split("T")[0]}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className={`apod-container ${isPending ? "apod-pending" : ""}`}>
        {apod ? (
          <div className="apod-content fade-in">
            <div className="Apod-header">{apod.title}</div>
            {apod.media_type === "image" ? (
              <img
                src={apod.url}
                alt={apod.title}
                className="apod-image"
                loading="lazy"
              />
            ) : (
              <iframe
                title={apod.title}
                src={apod.url}
                className="apod-iframe"
                allowFullScreen
              />
            )}
            <div className="Apod-description">
              <p>{apod.explanation}</p>
            </div>
          </div>
        ) : (
          <p>No APOD found for the given date.</p>
        )}
      </div>
    </div>
  );
};

export default SearchApod;
