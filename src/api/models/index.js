const mongoose = require('mongoose');
const winston = require('winston');
const env = require('dotenv');

const { MONGO_DB, MONGO_USER, MONGO_PASSWORD } = process.env;
// const logger = loggers.get('MyLog');
// setup mongodb connection
const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@reactgames.q9fou.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

// connect to mongodb
mongoose.set('useFindAndModify', false);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => winston.info('Connected to mongodb'))
  .catch((err) => winston.error('Couldn\'t connect to mongodb', { message: err }));

// close connection when disconected
mongoose.connection.on('disconnected', () => {
  mongoose.connection.close();
});

// set global promises as mongoose promises
mongoose.Promise = global.Promise;

// export mongoose
module.exports = mongoose;
