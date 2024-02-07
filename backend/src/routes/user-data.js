const express = require('express');
const docClient = require('../utils/db-client');
const logger = require('../utils/logger');
const { ScanCommand, PutCommand, QueryCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const router = express.Router();

function validateInput(input) {
  const allowedRegex = /^[\w\s.,-]+$|^(auth0\|[0-9a-zA-Z]+)$/;
  if (typeof input === 'string') {
    if (!allowedRegex.test(input)) {
      throw new Error('Invalid input detected');
    }
  } else if (Array.isArray(input)) {
    input.forEach(element => validateInput(element));
  } else if (input !== null && typeof input === 'object') {
    Object.values(input).forEach(value => validateInput(value));
  } else if (typeof input !== 'number' && typeof input !== 'boolean') {
    throw new Error('Unsupported input type detected');
  }
}

router.post('/saveApplication', async (req, res) => {
  try {
    // Get input
    const { userId, company, jobTitle, location, workLocation, progress, date } = req.body;
    
    // Check for missing fields
    if (!userId || !company ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize input
    [userId, company, jobTitle, location, workLocation, progress, date].forEach(validateInput);

    // Generate applicationId
    const applicationId = uuidv4();

    // Parameters for saving application
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

    // Save application to DynamoDB
    await docClient.send(new PutCommand(params));
    
    // Send response
    res.status(200).json({ message: 'User data added successfully' });
  } catch (err) {
    // Log error and send response
    logger.error(err);
    res.status(500).json({ error: 'Error saving data to DynamoDB' });
    console.log(err);
  }
});

router.post('/fetchApplications', async (req, res) => {
  try {
    // Get input
    let { userId } = req.body;

    // Check for missing fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize input
    validateInput(userId);

    // Parameters for fetching applications
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
      // Fetch applications from DynamoDB
      result = await docClient.send(new QueryCommand(params));
      allItems = allItems.concat(result.Items);

      // Continue fetching if there are more items
      params.ExclusiveStartKey = result.LastEvaluatedKey;
    } while (typeof result.LastEvaluatedKey !== "undefined");

    // Send response
    res.json(allItems);
  } catch (err) {
    // Log error and send response
    logger.error(err);
    res.status(500).json({ error: 'Error retrieving data from DynamoDB' });
    console.log(err);
  }
});

router.post('/deleteApplications', async (req, res) => {
  try {
    // Get input
    let { applicationIds, userId } = req.body;

    // Check for missing fields
    if (!applicationIds || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize input
    [userId, applicationIds].forEach(validateInput);

    // Batch delete requests
    const deleteRequests = applicationIds.map(ApplicationId => ({
      DeleteRequest: {
        Key: { UserId: userId, ApplicationId }
      }
    }));

    // Parameters for batch delete
    const params = {
      RequestItems: {
        'Applications': deleteRequests
      }
    };

    // Delete applications from DynamoDB
    await docClient.send(new BatchWriteCommand(params));

    // Send response
    res.status(200).json({ message: 'Applications deleted successfully' });
  } catch (err) {
    // Log error and send response
    logger.error(err);
    res.status(500).json({ error: 'Error deleting applications from DynamoDB' });
    console.log(err);
  }
});

router.post('/updateProgress', async (req, res) => {
  try {
    // Get input
    let { userId, applicationId, progress } = req.body;

    // Check for missing fields
    if (!userId || !applicationId || !progress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize input
    [userId, applicationId, progress].forEach(validateInput);
    
    // Parmeters for updating progress
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

    // Update progress in DynamoDB
    await docClient.send(new UpdateCommand(params));

    // Send response
    res.status(200).json({ message: 'Application progress updated successfully' });
  } catch (err) {
    // Log error and send response
    logger.error(err);
    res.status(500).json({ error: 'Error updating application progress in DynamoDB' });
    console.log(err);
  }
});

module.exports = router;
