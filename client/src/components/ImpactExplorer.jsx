import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function normalizeSeries(items, dateKey, valueKey, outputKey) {
  if (!items?.length) return [];

  const sorted = [...items].sort((a, b) =>
    String(a[dateKey]).localeCompare(String(b[dateKey]))
  );

  const firstValue = Number(sorted[0][valueKey]);

  return sorted.map((item) => ({
    date: String(item[dateKey]).slice(0, 10),
    [outputKey]:
      firstValue > 0
        ? (Number(item[valueKey]) / firstValue) * 100
        : null,
  }));
}

export default function ImpactExplorer({ impact, loading, error }) {
  if (loading) {
    return <div className="state-message">Comparing news and price history...</div>;
  }

  if (error) {
    return <div className="state-message error">{error}</div>;
  }

  if (!impact) {
    return (
      <div className="state-message">
        Search for a company and load its stock to explore the comparison.
      </div>
    );
  }

  const news = normalizeSeries(
    impact.newsTimeline,
    "date",
    "volume",
    "newsIndex"
  );

  const prices = normalizeSeries(
    impact.prices,
    "date",
    "close",
    "priceIndex"
  );

  const byDate = new Map();

  news.forEach((item) => {
    byDate.set(item.date, {
      ...byDate.get(item.date),
      date: item.date,
      newsIndex: item.newsIndex,
    });
  });

  prices.forEach((item) => {
    byDate.set(item.date, {
      ...byDate.get(item.date),
      date: item.date,
      priceIndex: item.priceIndex,
    });
  });

  const chartData = [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!chartData.length) {
    return <div className="state-message">No comparison data available.</div>;
  }

  return (
    <>
      <div className="impact-legend-note">
        Both series are indexed to 100 at their respective starting points.
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#242b3b" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#929bb0", fontSize: 11 }}
            minTickGap={35}
          />
          <YAxis tick={{ fill: "#929bb0", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#171c2a",
              border: "1px solid #343c50",
              borderRadius: 10,
              color: "#fff",
            }}
            formatter={(value) =>
              value == null ? ["No data", ""] : [value.toFixed(2), "Index"]
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="newsIndex"
            name="News volume index"
            stroke="#f4b860"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="priceIndex"
            name="Stock price index"
            stroke="#9b8cff"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="disclaimer">
        This visualization shows timing and relative movement, not proof that
        news caused a stock-price change. The series may use different time
        intervals and reporting windows.
      </p>
    </>
  );
}