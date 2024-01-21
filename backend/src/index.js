const express = require('express');
const cors = require('cors');
require('./config/environmentVariables');
const logger = require('./utils/logger');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.SERVER_PORT;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}/`);
});
