import { Bookmark, Plus, Trash2 } from "lucide-react";

export default function Watchlist({
  watchlist,
  onAdd,
  onRemove,
  onSelect,
}) {
  const [symbolInput, setSymbolInput] = [undefined, undefined];
  // The actual controlled input state is managed below via a child form.
  // Keeping the form separate makes the watchlist reusable.

  return (
    <div>
      <form
        className="watchlist-add"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const input = form.elements.namedItem("symbol");
          const symbol = input.value.trim().toUpperCase();

          if (symbol) {
            onAdd(symbol);
            input.value = "";
          }
        }}
      >
        <input
          name="symbol"
          placeholder="Add ticker (e.g. TSLA)"
          aria-label="Add ticker to watchlist"
          maxLength={15}
        />
        <button type="submit" aria-label="Add to watchlist">
          <Plus size={17} />
        </button>
      </form>

      {watchlist.length === 0 ? (
        <p className="empty-watchlist">
          <Bookmark size={18} />
          Your watchlist is empty. Add a ticker to follow it.
        </p>
      ) : (
        <div className="watchlist-items">
          {watchlist.map((symbol) => (
            <div className="watchlist-row" key={symbol}>
              <button
                className="watchlist-symbol"
                onClick={() => onSelect(symbol)}
              >
                <span className="ticker-avatar">{symbol.slice(0, 1)}</span>
                <strong>{symbol}</strong>
              </button>

              <button
                className="icon-button"
                onClick={() => onRemove(symbol)}
                aria-label={`Remove ${symbol}`}
                title="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}