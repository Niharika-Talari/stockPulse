
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const newsRoutes = require("./routes/news");
const stockRoutes = require("./routes/stocks");
const impactRoutes = require("./routes/impact");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MarketPulse API is running" });
});

app.use("/api/news", newsRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/impact", impactRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

app.listen(PORT, () => {
  console.log(`MarketPulse backend running at http://localhost:${PORT}`);
});
