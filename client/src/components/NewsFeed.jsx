import { ExternalLink, Globe2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "Date unavailable";

  // GDELT dates often arrive as YYYYMMDDTHHmmssZ.
  const normalized = value.replace(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/,
    "$1-$2-$3T$4:$5:$6Z"
  );

  const date = new Date(normalized);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

export default function NewsFeed({ articles, loading, error }) {
  if (loading) {
    return <div className="state-message">Loading news from GDELT...</div>;
  }

  if (error) {
    return <div className="state-message error">{error}</div>;
  }

  if (!articles.length) {
    return <div className="state-message">No articles found for this search.</div>;
  }

  return (
    <div className="news-list">
      {articles.map((article, index) => (
        <article
          className="news-item"
          key={`${article.url}-${index}`}
        >
          <div className="news-source-icon"><Globe2 size={17} /></div>

          <div className="news-content">
            <div className="news-meta">
              <span>{article.source}</span>
              <span>·</span>
              <time>{formatDate(article.publishedAt)}</time>
            </div>

            <h3>{article.title}</h3>

            <div className="news-footer">
              <span>{article.country || "Global coverage"}</span>
              {article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read article <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}