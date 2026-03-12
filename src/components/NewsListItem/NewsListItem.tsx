import { Link } from "react-router";
import type { NewsItem } from "../../types";

type Props = {
  item: NewsItem;
};

export function NewsListItem({ item }: Props) {
  return (
    <li className="news-card">
      <article>
        <p className="news-card__author">Eftir {item.author.name}</p>
        <h2 className="news-card__title">
          <Link to={`/frettir/${item.slug}`}>{item.title}</Link>
        </h2>
        <p className="news-card__intro">{item.intro}</p>
        <Link className="news-card__link" to={`/frettir/${item.slug}`}>
          Lesa meira
        </Link>
      </article>
    </li>
  );
}
