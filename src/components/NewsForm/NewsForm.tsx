import { useEffect, useState } from "react";
import { createNewsItem, getAuthors } from "../../lib/news.api";
import type { NewsAuthor } from "../../types";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-");
}

export function NewsForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [published, setPublished] = useState(false);

  const [authors, setAuthors] = useState<NewsAuthor[]>([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAuthors = async () => {
      setAuthorsLoading(true);

      const response = await getAuthors();

      if (response.ok) {
        setAuthors(response.data.data);
        if (response.data.data.length > 0) {
          setAuthorId(String(response.data.data[0].id));
        }
      } else {
        setMessage(`Tókst ekki að sækja höfunda: ${response.error.message}`);
      }

      setAuthorsLoading(false);
    };

    loadAuthors();
  }, []);

  useEffect(() => {
    setSlug(makeSlug(title));
  }, [title]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitState("loading");
    setMessage("");

    const body = {
      slug,
      title,
      excerpt,
      content,
      authorId: Number(authorId),
      published,
    };

    const response = await createNewsItem(body);

    if (response.ok) {
      setSubmitState("success");
      setMessage(`Fréttin "${response.data.title}" var stofnuð.`);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setContent("");
      setPublished(false);
      if (authors.length > 0) {
        setAuthorId(String(authors[0].id));
      }
      return;
    }

    setSubmitState("error");
    setMessage(response.error.message);
  };

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <div className="news-form__field">
        <label htmlFor="title">Titill</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="news-form__field">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      <div className="news-form__field">
        <label htmlFor="excerpt">Útdráttur</label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>

      <div className="news-form__field">
        <label htmlFor="content">Texti</label>
        <textarea
          id="content"
          name="content"
          required
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="news-form__field">
        <label htmlFor="authorId">Höfundur</label>
        <select
          id="authorId"
          name="authorId"
          required
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          disabled={authorsLoading || authors.length === 0}
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>

      <label className="news-form__checkbox">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Birta strax
      </label>

      <button type="submit" disabled={submitState === "loading" || authorsLoading}>
        {submitState === "loading" ? "Vista..." : "Búa til frétt"}
      </button>

      {message && (
        <p className={submitState === "success" ? "form-message form-message--success" : "form-message form-message--error"}>
          {message}
        </p>
      )}
    </form>
  );
}
