// Importing game model
const winston = require('winston');
const Game = require('../models/games.model.js');

module.exports = {
  /*
        get all the games in the database
        @todo: add condition
     */
  getAllGames: async (req, res, next) => {
    try {
      winston.info('Getting all the games');
      // getting all the games
      const games = await Game.find();
      winston.info('Getting all the games finish', { result: games });
      return res.json(games);
    } catch (e) {
      winston.error(e);
      return next(e);
    }
  },

  /**
   * Get the game by the id (name)
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {Promise}       [description]
   * // TODO: no devuelve nada cuando no hay players
   */
  getGameByID: async (req, res, next) => {
    const { id } = req.params;
    try {
      winston.info('Getting a game', { id });
      // find the game by id
      const game = await Game.aggregate([
        { $match: { name: id } },
        { $unwind: '$players' },
        { $sort: { 'players.points': -1 } },
        { $project: { name: 1, description: 1, players: 1 } },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            description: { $first: '$description' },
            players: { $push: '$players' },
          },
        },
      ]);
      winston.info('Getting a game', { id, result: game });
      return res.json(game[0] ? game[0] : {});
    } catch (e) {
      winston.error(e);
      return next(e);
    }
  },

  getPlayersOfAGame: async (req, res, next) => {
    const { id } = req.params;
    try {
      winston.info('Getting players for a game', { id });
      const players = await Game.findById(id, 'players');
      winston.info('End getting players for a game', { id, result: players });
      return res.json(players);
    } catch (e) {
      winston.error(e);
      return next(e);
    }
  },

  createGame: async (req, res, next) => {
    const { body } = req;
    try {
      winston.info('Creating a game', { game: body });
      const game = new Game({
        name: body.name,
        players: body.players ? body.players : [],
        description: body.description,
      });
      const data = await game.save();
      winston.info('Game created', { game: body });
      return res.status(201).json(data);
    } catch (e) {
      winston.error(e);
      return next(e);
    }
  },
  /**
  body: {
    name: string,
    points: Integer
  }
  * */
  // TODO: check what happend if send a game that does not exists
  addPlayersToGame: async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    winston.info('Inserting player to game', { id, player: body });
    const condition = {
      name: id,
      'players.name': { $ne: body.name },
    };
    const update = { $addToSet: { players: { name: body.name, points: body.points } } };
    const options = { new: true };
    try {
      let player;
      const game = await Game.findOneAndUpdate(condition, update, options);
      if (game) {
        player = game.players.find((p) => p.name === body.name);
        winston.info('Inserted player', { id, player });
        return res.status(201).json(player);
      }
      return res.status(404).json({ error: true, message: 'game does not exists' });
    } catch (e) {
      winston.error(e);
      return next(e);
    }
  },

  updatePlayer: async (req, res, next) => {
    const { idP, idG } = req.params;
    const { body } = req;
    winston.info('Updating player', { id: idG, player: body, idP });
    try {
      const condition = {
        name: idG,
        'players._id': idP,
      };
      console.log('nombre', body.name);
      console.log('puntos', body.points);
      const game = await Game.updateOne(condition,
        { $set: { 'players.$.name': body.name, 'players.$.points': body.points } });
      const player = await Game.find({ name: idG, 'players._id': idP }, { 'players.$': 1 });
      return res.json(player);
    } catch (e) {
      return next(e);
    }
  },
};
