const express = require('express');
const router = express.Router();
const axios = require('axios');
const { updateWindowAndCalculateAverage } = require('../services/averageService');

const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJha2lsYW4uMjJjc0BrY3QuYWMuaW4iLCJleHAiOjE3NTA0ODUwOTAsImlhdCI6MTc1MDQ4NDc5MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImM5OWZhZTU3LWRlNzktNDQ0OC1iOGMxLWRjNTBjZWQ4YWFmOCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFraWxhbiIsInN1YiI6IjQwYzVmODAzLWY0NmMtNGZmOC1iYjNlLTBkOTlkZmYyMTk1YSJ9LCJlbWFpbCI6ImFraWxhbi4yMmNzQGtjdC5hYy5pbiIsIm5hbWUiOiJha2lsYW4iLCJyb2xsTm8iOiIyMmJjczAwNiIsImFjY2Vzc0NvZGUiOiJXY1RTS3YiLCJjbGllbnRJRCI6IjQwYzVmODAzLWY0NmMtNGZmOC1iYjNlLTBkOTlkZmYyMTk1YSIsImNsaWVudFNlY3JldCI6ImZIUVROZ0ZRSGFnbWJiQkgifQ.3vY5gW0tABov2rbokSyC1fmJ2EmmQH8yJgzu0ZEAKiM";

const endpoints = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

router.get('/:type', async (req, res) => {
  const type = req.params.type?.toLowerCase();

  const api = endpoints[type];
  if (!api) {
    return res.status(400).json({ error: 'Invalid type provided' });
  }

  const url = `http://20.244.56.144/evaluation-service/${api}`;

  try {
    const externalResponse = await Promise.race([
      axios.get(url, {
        headers: {
          Authorization: AUTH_TOKEN
        }
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), 500)
      )
    ]);

    const responseData = externalResponse.data?.numbers || [];
    const output = updateWindowAndCalculateAverage(responseData);
    res.json(output);
  } catch (err) {
    console.error("Fetch error:", err.response?.data || err.message); // SHOW EXACT ERROR
    return res.status(503).json({ error: 'External API issue' });
  }
});

module.exports = router;
