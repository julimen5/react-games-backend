const express = require('express');

const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/api/routes');
require('./loggers');
require('dotenv').config({ debug: true });
require('./src/api/models');

app.use(bodyParser.json());

const { PORT } = process.env;

app.use(morgan('tiny'));
app.use(cors()); // @todo: checkout how cors plugin works
app.get('/ping', (req, res, next) => res.send('pong'));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
