import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function StockChart({ prices }) {
  if (!prices?.length) {
    return <div className="state-message">No price history available.</div>;
  }

  const chartData = prices.map((item) => ({
    ...item,
    label: item.date.slice(5),
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b7cff" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8b7cff" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#242b3b" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#929bb0", fontSize: 11 }}
            minTickGap={35}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#929bb0", fontSize: 11 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            width={55}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#171c2a",
              border: "1px solid #343c50",
              borderRadius: 10,
              color: "#fff",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Close"]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke="#9b8cff"
            strokeWidth={2}
            fill="url(#priceFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}