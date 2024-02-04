const express = require('express');
const docClient = require('../utils/db-client');
const logger = require('../utils/logger');
const { ScanCommand, PutCommand, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: 'Applications'
    }));
    res.json(result.Items);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error retrieving data from DynamoDB' });
    console.log(err);
  }
});

router.post('/saveApplication', async (req, res) => {
  try {
    const { userId, company, jobTitle, location, workLocation, progress, date } = req.body;

    console.log(date);
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
        progress,
        date,
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
    res.json(allItems);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error retrieving data from DynamoDB' });
    console.log(err);
  }
});

router.post('/deleteApplications', async (req, res) => {
  try {
    const { applicationIds, userId } = req.body;
    console.log(applicationIds);

    // Validate that applicationIds is an array
    if (!Array.isArray(applicationIds)) {
      return res.status(400).json({ error: 'Invalid input. ApplicationIds should be an array' });
    }

    // Prepare batch delete request
    const deleteRequests = applicationIds.map(ApplicationId => ({
      DeleteRequest: {
        Key: { UserId: userId, ApplicationId }
      }
    }));

    const params = {
      RequestItems: {
        'Applications': deleteRequests
      }
    };

    const result = await docClient.send(new BatchWriteCommand(params));
    console.log('Batch delete result:', result);

    res.status(200).json({ message: 'Applications deleted successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error deleting applications from DynamoDB' });
    console.log(err);
  }
});

router.post('/updateProgress', async (req, res) => {
  try {
    const { userId, applicationId, progress } = req.body;

    if (!userId || !applicationId || !progress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const params = {
      TableName: 'Applications',
      Key: {
        UserId: userId,
        ApplicationId: applicationId
      },
      UpdateExpression: 'set progress = :p',
      ExpressionAttributeValues: {
        ':p': progress
      },
      ReturnValues: 'UPDATED_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    console.log('Update result:', result);
    res.status(200).json({ message: 'Application progress updated successfully' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Error updating application progress in DynamoDB' });
    console.log(err);
  }
});

module.exports = router;
