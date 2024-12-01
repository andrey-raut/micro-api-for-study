const express = require('express');
const cors = require('cors');
const { endpoints } = require('./endpoints');

const app = express();

app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World!' });
});
app.use(endpoints);

module.exports = {
  app,
};
