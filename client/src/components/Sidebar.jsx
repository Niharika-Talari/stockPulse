import {
  Activity,
  BarChart3,
  Bookmark,
  Globe2,
  LayoutDashboard,
} from "lucide-react";

const links = [
  { label: "Overview", icon: LayoutDashboard, id: "overview" },
  { label: "Global News", icon: Globe2, id: "news" },
  { label: "Market Trends", icon: BarChart3, id: "markets" },
  { label: "News Impact", icon: Activity, id: "impact" },
  { label: "Watchlist", icon: Bookmark, id: "watchlist" },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon"><Activity size={22} /></div>
        <div>
          <h1>MarketPulse</h1>
          <span>NEWS · MARKETS · INSIGHTS</span>
        </div>
      </div>

      <p className="nav-caption">WORKSPACE</p>

      <nav className="nav-links">
        {links.map(({ label, icon: Icon, id }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-link ${active === id ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="live-dot" />
        <div>
          <strong>Live intelligence</strong>
          <p>Powered by GDELT + Alpha Vantage</p>
        </div>
      </div>
    </aside>
  );
}