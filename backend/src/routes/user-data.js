const express = require('express');
const docClient = require('../utils/db-client');
const logger = require('../utils/logger');
const { ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

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

router.post('/saveApplication', async (req, res) => {
  try {
    const { userId, company, jobTitle, location, workLocation } = req.body;

    const applicationId = uuidv4();
    const params = {
      TableName: 'Applications',
      Item: {
        UserId: userId,
        ApplicationId: applicationId,
        company,
        jobTitle, 
        location, 
        workLocation
      }
    };

    await docClient.send(new PutCommand(params));
    res.status(200).json({ message: 'User data added successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error saving data to DynamoDB' });
    console.log(err);
  }
});

module.exports = router;
