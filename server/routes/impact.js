
const express = require("express");
const { getNewsTimeline } = require("../services/newsService");
const { getDailyPrices } = require("../services/alphaVantageService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = String(req.query.q || "Apple").trim().slice(0, 200);
    const symbol = String(req.query.symbol || "AAPL")
      .trim()
      .toUpperCase();

    if (!/^[A-Z0-9.-]{1,15}$/.test(symbol)) {
      return res.status(400).json({ error: "Invalid stock symbol." });
    }

    const [newsTimeline, stock] = await Promise.all([
      getNewsTimeline(query),
      getDailyPrices(symbol),
    ]);

    res.json({
      query,
      symbol,
      newsTimeline,
      prices: stock.prices,
      note: "News volume and stock prices show a time comparison, not causation.",
    });
  } catch (error) {
    console.error("Impact route:", error.message);
    res.status(502).json({
      error: error.message || "Unable to load impact comparison.",
    });
  }
});

module.exports = router;
