
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Globe2,
  RefreshCw,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import StatCard from "./components/StatCard";
import NewsFeed from "./components/NewsFeed";
import StockChart from "./components/StockChart";
import StockSearch from "./components/StockSearch";
import Watchlist from "./components/Watchlist";
import ImpactExplorer from "./components/ImpactExplorer";
import useLocalStorage from "./hooks/useLocalStorage";

import {
  fetchNews,
  fetchStock,
  fetchImpact,
} from "./services/api";

const DEFAULT_QUERY = "Apple";
const DEFAULT_SYMBOL = "AAPL";

function formatMoney(value) {
  return value == null
    ? "—"
    : `$${Number(value).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
}

export default function App() {
  const [active, setActive] = useState("overview");

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);

  const [articles, setArticles] = useState([]);
  const [stock, setStock] = useState(null);
  const [impact, setImpact] = useState(null);

  const [newsLoading, setNewsLoading] = useState(false);
  const [stockLoading, setStockLoading] = useState(false);
  const [impactLoading, setImpactLoading] = useState(false);

  const [newsError, setNewsError] = useState("");
  const [stockError, setStockError] = useState("");
  const [impactError, setImpactError] = useState("");

  const [watchlist, setWatchlist] = useLocalStorage(
    "marketpulse-watchlist",
    ["AAPL", "NVDA", "MSFT"]
  );

  const loadNews = useCallback(async (searchTerm) => {
    setNewsLoading(true);
    setNewsError("");

    try {
      const result = await fetchNews(searchTerm);
      setArticles(result.articles || []);
      setQuery(searchTerm);
    } catch (error) {
      setNewsError(error.message);
      setArticles([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const loadStock = useCallback(async (requestedSymbol = DEFAULT_SYMBOL) => {
  const ticker = String(requestedSymbol).trim().toUpperCase();
  if (!ticker) return;

  setStockLoading(true);
  setStockError("");

  try {
    const result = await fetchStock(ticker);
    setStock(result);
    setSymbol(ticker);
  } catch (error) {
    setStockError(error.message);
    setStock(null);
  } finally {
    setStockLoading(false);
  }
   }, []);

  const loadImpact = useCallback(async (
    searchTerm = query,
    ticker = symbol
  ) => {
    setImpactLoading(true);
    setImpactError("");

    try {
      const result = await fetchImpact(searchTerm, ticker);
      setImpact(result);
    } catch (error) {
      setImpactError(error.message);
      setImpact(null);
    } finally {
      setImpactLoading(false);
    }
  }, [query, symbol]);

  useEffect(() => {
    loadNews(DEFAULT_QUERY);
    loadStock(DEFAULT_SYMBOL);
  }, [loadNews, loadStock]);

  function runNewsSearch() {
    const term = searchInput.trim();
    if (term) loadNews(term);
  }

  function addToWatchlist(ticker) {
    if (!/^[A-Z0-9.-]{1,15}$/.test(ticker)) return;

    setWatchlist((current) =>
      current.includes(ticker) ? current : [...current, ticker]
    );
  }

  function removeFromWatchlist(ticker) {
    setWatchlist((current) => current.filter((item) => item !== ticker));
  }

  function navigateTo(id) {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const gain = stock?.changePercent;
  const isPositive = Number(gain) >= 0;

  return (
    <div className="app-shell">
      <Sidebar active={active} onNavigate={navigateTo} />

      <main className="main-area">
        <Topbar
          query={searchInput}
          setQuery={setSearchInput}
          onSearch={runNewsSearch}
          loading={newsLoading}
        />

        <div className="dashboard-content" id="overview">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> MARKET INTELLIGENCE
              </div>
              <h2>See the story behind the market.</h2>
              <p>
                Explore global news, track stock performance, and compare
                how news volume and prices move over time.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={() => {
                loadNews(query);
                loadStock(symbol);
              }}
              disabled={newsLoading || stockLoading}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </section>

          <section className="stats-grid">
            <StatCard
              label="Selected stock"
              value={stock?.symbol || symbol}
              description="Alpha Vantage daily data"
            />

            <StatCard
              label="Latest closing price"
              value={formatMoney(stock?.latestPrice)}
              description="Most recent available daily close"
            />

            <StatCard
              label="Daily price change"
              value={
                stock
                  ? `${isPositive ? "+" : ""}${stock.changePercent.toFixed(2)}%`
                  : "—"
              }
              description={
                stock
                  ? `${isPositive ? "+" : ""}${formatMoney(stock.change)}`
                  : "Waiting for stock data"
              }
            />

            <StatCard
              label="Articles found"
              value={newsLoading ? "…" : articles.length}
              description="Results from GDELT"
            />
          </section>

          {stockError && (
            <div className="error-banner">
              <Activity size={16} /> {stockError}
            </div>
          )}

          <section className="panel stock-panel" id="markets">
            <div className="section-heading">
              <div>
                <div className="section-kicker">
                  <BarChart3 size={15} /> MARKET DATA
                </div>
                <h3>Stock performance</h3>
                <p>Daily closing prices from Alpha Vantage.</p>
              </div>
            </div>

            <StockSearch
              symbol={symbol}
              setSymbol={setSymbol}
              onSearch={loadStock}
              loading={stockLoading}
            />

            {stockLoading ? (
              <div className="state-message">Loading historical prices...</div>
            ) : stockError ? (
              <div className="state-message error">{stockError}</div>
            ) : stock ? (
              <>
                <div className="stock-price-heading">
                  <div>
                    <span className="muted-label">{stock.symbol} · USD</span>
                    <h2>{formatMoney(stock.latestPrice)}</h2>
                  </div>

                  <span className={`price-badge ${isPositive ? "up" : "down"}`}>
                    <ArrowUpRight size={15} />
                    {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <StockChart prices={stock.prices} />
              </>
            ) : (
              <div className="state-message">
                Stock data will appear here after a successful API response.
              </div>
            )}
          </section>

          <section className="panel news-panel" id="news">
            <div className="section-heading">
              <div>
                <div className="section-kicker">
                  <Globe2 size={15} /> GLOBAL COVERAGE
                </div>
                <h3>Global news intelligence</h3>
                <p>
                  Search by company, topic, or country. Articles link to their
                  original publishers.
                </p>
              </div>
              <span className="source-pill">GDELT</span>
            </div>

            <div className="current-query">
              Showing results for <strong>{query}</strong>
            </div>

            <NewsFeed
              articles={articles}
              loading={newsLoading}
              error={newsError}
            />
          </section>

          <section className="panel impact-panel" id="impact">
            <div className="section-heading">
              <div>
                <div className="section-kicker">
                  <Activity size={15} /> CROSS-SIGNAL EXPLORER
                </div>
                <h3>News & market movements</h3>
                <p>
                  Compare relative news volume with the selected stock's
                  historical closing prices.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => loadImpact(query, symbol)}
                disabled={impactLoading}
              >
                {impactLoading ? "Analyzing..." : "Explore impact"}
              </button>
            </div>

            <ImpactExplorer
              impact={impact}
              loading={impactLoading}
              error={impactError}
            />
          </section>

          <section className="panel watchlist-panel" id="watchlist">
            <div className="section-heading">
              <div>
                <div className="section-kicker">
                  <Activity size={15} /> PERSONAL TRACKER
                </div>
                <h3>Your watchlist</h3>
                <p>Saved locally in this browser.</p>
              </div>
              <span className="source-pill">localStorage</span>
            </div>

            <Watchlist
              watchlist={watchlist}
              onAdd={addToWatchlist}
              onRemove={removeFromWatchlist}
              onSelect={(ticker) => {
                setSymbol(ticker);
                loadStock(ticker);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </section>

          <footer className="app-footer">
            <span>MarketPulse</span>
            <span>Data provided by GDELT and Alpha Vantage.</span>
            <span>Market data may be delayed.</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
