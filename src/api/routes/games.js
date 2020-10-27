const express = require('express');

const router = express.Router();

const {
  getAllGames, getGameByID, getPlayersOfAGame, createGame, addPlayersToGame, updatePlayer,
} = require('../controllers/games');

router.get('/', getAllGames);
router.post('/', createGame);
router.get('/:id', getGameByID); // @todo: now its game
router.get('/:id/players', getPlayersOfAGame);
router.post('/:id/players', addPlayersToGame);
router.put('/:idG/players/:idP', updatePlayer);
module.exports = router;
