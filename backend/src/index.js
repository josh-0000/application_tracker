require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const applicationRoutes = require('./routes/user-data'); 
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.SERVER_PORT;

app.use('/applications', applicationRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}/`);
});
