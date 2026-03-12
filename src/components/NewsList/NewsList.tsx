import type { NewsItem } from "../../types";
import { NewsListItem } from "../NewsListItem/NewsListItem";

type Props = {
  news: NewsItem[];
};

export function NewsList({ news }: Props) {
  return (
    <ul className="news-list">
      {news.map((item) => (
        <NewsListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
