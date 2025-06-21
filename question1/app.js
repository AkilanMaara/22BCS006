const express = require('express');
const app = express();
const numbersRoute = require('./routes/numbers');

const PORT = 9876;

app.use(express.json());
app.use('/numbers', numbersRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

