const express = require('express');
const { todoEndpoints } = require('./todo');

const router = express.Router();

router.use(todoEndpoints);

module.exports = { endpoints: router };
