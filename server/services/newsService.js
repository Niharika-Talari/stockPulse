
const BASE_URL = "https://gnews.io/api/v4/search";

async function requestNews(query) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY is missing from server/.env");
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("q", query || "technology");
  url.searchParams.set("lang", "en");
  url.searchParams.set("max", "10");

  const response = await fetch(url, {
    headers: {
      "X-Api-Key": apiKey,
    },
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`GNews returned an invalid response: ${text.slice(0, 200)}`);
  }

  if (!response.ok) {
    throw new Error(
      `GNews HTTP ${response.status}: ${
        data.errors?.join(", ") || data.message || text.slice(0, 200)
      }`
    );
  }

  return data.articles || [];
}

async function searchNews(query) {
  const articles = await requestNews(query);

  return articles.map((article) => ({
    title: article.title,
    url: article.url,
    source: article.source?.name || "Unknown source",
    publishedAt: article.publishedAt || null,
    language: "en",
    country: null,
    description: article.description || "",
    image: article.image || null,
  }));
}

async function getNewsTimeline(query) {
  const articles = await requestNews(query);
  const counts = {};

  for (const article of articles) {
    if (!article.publishedAt) continue;

    const date = article.publishedAt.slice(0, 10);
    counts[date] = (counts[date] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

module.exports = { searchNews, getNewsTimeline };
