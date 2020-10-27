const express = require('express');

const router = express.Router();
const gamesRoutes = require('./games');

router.use('/games', gamesRoutes);

module.exports = router;
