import { Search, Command } from "lucide-react";

export default function Topbar({ query, setQuery, onSearch, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span>/</span>
        <strong>Market overview</strong>
      </div>

      <form className="global-search" onSubmit={handleSubmit}>
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a company, topic or country..."
          aria-label="Search global news"
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
        <span className="search-shortcut"><Command size={12} /> K</span>
      </form>
    </header>
  );
}