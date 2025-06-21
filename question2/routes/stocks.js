const express = require('express');
const router = express.Router();
const axios = require('axios');

const STOCK_API_BASE = 'http://20.244.56.144/evaluation-service';
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha2lsYW4uMjJjc0BrY3QuYWMuaW4iLCJleHAiOjE3NTA0ODY1NzUsImlhdCI6MTc1MDQ4NjI3NSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImIwODI2NmY2LTYzZDYtNDI0ZC1hZGI4LWRjY2Y1Njk1Nzc4NyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFraWxhbiIsInN1YiI6IjQwYzVmODAzLWY0NmMtNGZmOC1iYjNlLTBkOTlkZmYyMTk1YSJ9LCJlbWFpbCI6ImFraWxhbi4yMmNzQGtjdC5hYy5pbiIsIm5hbWUiOiJha2lsYW4iLCJyb2xsTm8iOiIyMmJjczAwNiIsImFjY2Vzc0NvZGUiOiJXY1RTS3YiLCJjbGllbnRJRCI6IjQwYzVmODAzLWY0NmMtNGZmOC1iYjNlLTBkOTlkZmYyMTk1YSIsImNsaWVudFNlY3JldCI6ImZIUVROZ0ZRSGFnbWJiQkgifQ.f2bk1JfRTPkDXW8zTHSG8vCkVWfXMmggSvIHR1jPTR0";


router.get('/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const minutes = req.query.minutes || 0;
  const aggregation = req.query.aggregation || '';

  try {
    let url = `${STOCK_API_BASE}/stocks/${ticker}`;
    if (minutes > 0) {
      url += `?minutes=${minutes}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: AUTH_TOKEN
      }
    });

    const data = response.data;

    if (aggregation === 'average' && data.stock) {
      const prices = Array.isArray(data.stock)
        ? data.stock.map(p => p.price)
        : [data.stock.price];

      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

      return res.json({
        averageStockPrice: Math.round(avg * 100000) / 100000,
        priceHistory: data.stock
      });
    } else {
      return res.json(data);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

module.exports = router;
