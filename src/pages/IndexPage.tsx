import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LoadingSkeleton } from "../components/LoadingSkeleton/LoadingSkeleton";
import { NewsList } from "../components/NewsList/NewsList";
import { Pagination } from "../components/Pagination/Pagination";
import { getNews } from "../lib/news.api";
import type { NewsItem, NewsState } from "../types";

const NEWS_PER_PAGE = 5;

export function IndexPage() {
  const [newsState, setNewsState] = useState<NewsState>("initial");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setNewsState("loading");
      setErrorMessage("");

      const newsResponse = await getNews();

      if (newsResponse.ok) {
        const items = newsResponse.data.data;
        setNews(items);
        setNewsState(items.length > 0 ? "data" : "empty");
        return;
      }

      setNewsState("error");
      setErrorMessage(newsResponse.error.message);
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(news.length / NEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
  const visibleNews = news.slice(startIndex, startIndex + NEWS_PER_PAGE);

  return (
    <section className="page">
      <header className="page-header">
        <p className="page-header__eyebrow">Vefforritun 2 verkefni 4</p>
        <h1>Fréttir</h1>
        <p className="page-header__intro">
          Forsíðan birtir allar fréttir með titli, útdrætti og höfundi.
        </p>
        <Link className="page-header__cta" to="/ny-frett">
          Skrá nýja frétt
        </Link>
      </header>

      {newsState === "loading" && <LoadingSkeleton />}

      {newsState === "data" && (
        <>
          <NewsList news={visibleNews} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {newsState === "empty" && <p>Engar fréttir fundust.</p>}
      {newsState === "error" && <p>Villa kom upp: {errorMessage}</p>}
    </section>
  );
}
