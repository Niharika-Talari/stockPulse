const express = require("express");
const { getDailyPrices } = require("../services/alphaVantageService");

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  try {
    const symbol = String(req.params.symbol || "").trim().toUpperCase();

    if (!/^[A-Z0-9.-]{1,15}$/.test(symbol)) {
      return res.status(400).json({ error: "Invalid stock symbol." });
    }

    const stock = await getDailyPrices(symbol);
    res.json(stock);
  } catch (error) {
    console.error("Stock route:", error.message);
    res.status(502).json({
      error: error.message || "Unable to fetch stock prices.",
    });
  }
});

module.exports = router;