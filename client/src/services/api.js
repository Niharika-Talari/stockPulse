const API_BASE = "http://localhost:5000/api";

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed. Please try again.");
  }

  return data;
}

export function fetchNews(query) {
  return request(`/news?q=${encodeURIComponent(query)}`);
}

export function fetchStock(symbol) {
  return request(`/stocks/${encodeURIComponent(symbol)}`);
}

export function fetchImpact(query, symbol) {
  const params = new URLSearchParams({ q: query, symbol });
  return request(`/impact?${params.toString()}`);
}