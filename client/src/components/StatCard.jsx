import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  change,
  description,
}) {
  const numericChange = Number(change);
  const positive = numericChange >= 0;
  const hasChange = change !== undefined && change !== null;

  return (
    <article className="stat-card">
      <p className="stat-label">{label}</p>
      <h3>{value}</h3>

      {hasChange && (
        <div className={`stat-change ${positive ? "positive" : "negative"}`}>
          {positive
            ? <ArrowUpRight size={16} />
            : <ArrowDownRight size={16} />}
          {positive ? "+" : ""}{numericChange.toFixed(2)}%
          <span>vs previous close</span>
        </div>
      )}

      {description && <p className="stat-description">{description}</p>}
    </article>
  );
}