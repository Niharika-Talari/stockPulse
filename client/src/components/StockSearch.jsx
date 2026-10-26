import { Search } from "lucide-react";

const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
];

export default function StockSearch({ symbol, setSymbol, onSearch, loading }) {
  function submit(event) {
  event.preventDefault();
  onSearch(symbol);
  }

  return (
    <div className="stock-search-area">
      <form className="stock-search" onSubmit={submit}>
        <Search size={17} />
        <input
          value={symbol}
          onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          placeholder="Enter ticker, e.g. AAPL"
          aria-label="Stock ticker"
          maxLength={15}
        />
        <button disabled={loading || !symbol.trim()}>
          {loading ? "Loading..." : "Load stock"}
        </button>
      </form>

      <div className="ticker-chips">
        {POPULAR_STOCKS.map((stock) => (
          <button
            key={stock.symbol}
            type="button"
            className={symbol === stock.symbol ? "ticker-chip selected" : "ticker-chip"}
            onClick={() => {
              setSymbol(stock.symbol);
              onSearch(stock.symbol);
            }}
          >
            <strong>{stock.symbol}</strong> {stock.name}
          </button>
        ))}
      </div>
    </div>
  );
}