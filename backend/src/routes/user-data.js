const express = require('express');
const docClient = require('../utils/db-client'); // Ensure this is the correct path
const logger = require('../utils/logger'); // Ensure this is the correct path
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: 'Applications'
    }));
    res.json(result.Items);
    console.log(result.Items);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error retrieving data from DynamoDB' });
    console.log(err);
  }
});


module.exports = router;
