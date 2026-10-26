
const BASE_URL = "https://www.alphavantage.co/query";

async function getDailyPrices(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey || apiKey === "your_alpha_vantage_api_key") {
    throw new Error("Add your Alpha Vantage API key to server/.env.");
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("function", "TIME_SERIES_DAILY");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("outputsize", "compact");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Alpha Vantage HTTP error: ${response.status}`);
  }

  const data = await response.json();

  if (data.Note || data.Information || data["Error Message"]) {
    throw new Error(
      data.Note ||
      data.Information ||
      data["Error Message"]
    );
  }

  const timeSeries = data["Time Series (Daily)"];

  if (!timeSeries) {
    throw new Error("No stock data returned. Check the symbol or API limit.");
  }

  const prices = Object.entries(timeSeries)
    .map(([date, values]) => ({
      date,
      open: Number(values["1. open"]),
      high: Number(values["2. high"]),
      low: Number(values["3. low"]),
      close: Number(values["4. close"]),
      volume: Number(values["5. volume"]),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const latest = prices[prices.length - 1];
  const previous = prices[prices.length - 2];

  const change = previous
    ? latest.close - previous.close
    : 0;

  const changePercent = previous && previous.close !== 0
    ? (change / previous.close) * 100
    : 0;

  return {
    symbol: symbol.toUpperCase(),
    latestPrice: latest.close,
    previousClose: previous?.close ?? null,
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
    prices,
  };
}

module.exports = { getDailyPrices };
