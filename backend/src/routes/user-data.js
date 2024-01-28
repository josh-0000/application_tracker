const express = require('express');
const docClient = require('../utils/db-client');
const logger = require('../utils/logger');
const { ScanCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
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
    const { userId, company, jobTitle, location, workLocation, progress } = req.body;

    const applicationId = uuidv4();
    const params = {
      TableName: 'Applications',
      Item: {
        UserId: userId,
        ApplicationId: applicationId,
        company,
        jobTitle, 
        location, 
        workLocation,
        progress
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

router.post('/fetchApplications', async (req, res) => {
  try {
    const { userId } = req.body;
    let params = {
      TableName: 'Applications',
      KeyConditionExpression: 'UserId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    let allItems = [];
    let result;

    do {
      result = await docClient.send(new QueryCommand(params));
      allItems = allItems.concat(result.Items);
      params.ExclusiveStartKey = result.LastEvaluatedKey;
    } while (typeof result.LastEvaluatedKey !== "undefined");

    console.log(allItems);
    res.json(allItems);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error retrieving data from DynamoDB' });
    console.log(err);
  }
});

module.exports = router;
