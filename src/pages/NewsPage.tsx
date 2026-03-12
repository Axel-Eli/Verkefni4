import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { getNewsItem } from "../lib/news.api";
import type { NewsItem, NewsState } from "../types";

export function NewsPage() {
  const params = useParams();
  const [newsState, setNewsState] = useState<NewsState>("initial");
  const [news, setNews] = useState<NewsItem | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const slug = params.slug ?? "";

      if (!slug) {
        setNewsState("error");
        setErrorMessage("Ógild slóð á frétt.");
        return;
      }

      setNewsState("loading");
      setErrorMessage("");

      const newsResponse = await getNewsItem(slug);

      if (newsResponse.ok) {
        setNews(newsResponse.data);
        setNewsState("data");
        return;
      }

      setNews(null);

      if (newsResponse.reason === "not-found") {
        setNewsState("empty");
        setErrorMessage(newsResponse.error.message);
        return;
      }

      setNewsState("error");
      setErrorMessage(newsResponse.error.message);
    };

    fetchData();
  }, [params.slug]);

  return (
    <section className="page">
      <p>
        <Link to="/">Aftur á forsíðu</Link>
      </p>

      {newsState === "loading" && <LoadingSkeleton />}

      {newsState === "empty" && (
        <article className="news-card">
          <h1>Frétt fannst ekki</h1>
          <p>{errorMessage || "Fann ekki frétt með þessari slóð."}</p>
        </article>
      )}

      {newsState === "error" && (
        <article className="news-card">
          <h1>Villa kom upp</h1>
          <p>{errorMessage || "Ekki tókst að sækja fréttina."}</p>
        </article>
      )}

      {newsState === "data" && news && (
        <article className="news-card news-card--full">
          <p className="news-card__author">Eftir {news.author.name}</p>
          <h1 className="news-card__title">{news.title}</h1>
          <p className="news-card__intro">{news.intro}</p>
          <div className="news-card__body">
            <p>{news.text ?? "Það vantar texta fyrir þessa frétt."}</p>
          </div>
        </article>
      )}
    </section>
  );
}
