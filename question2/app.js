const express = require('express');
const app = express();
const stocksRoute = require('./routes/stocks');

const PORT = 9877;

app.use(express.json());
app.use('/stocks', stocksRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
