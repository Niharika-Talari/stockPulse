const express = require("express");
const router = express.Router();

const { searchNews } = require("../services/newsService");

router.get("/", async (req, res) => {
  try {
    const query = req.query.q || "technology";
    const articles = await searchNews(query);

    res.json({ articles });
  } catch (error) {
    console.error("NEWS ROUTE ERROR:", error);

    res.status(502).json({
      error: error.message,
    });
  }
});

module.exports = router;