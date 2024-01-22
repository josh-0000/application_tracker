const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.SERVER_PORT) {
  throw new Error('Missing SERVER_PORT environment variable.');
}

if (!process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('Missing AWS_ACCESS_KEY_ID environment variable.');
}

if (!process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('Missing AWS_SECRET_ACCESS_KEY environment variable.');
}

if (!process.env.AWS_REGION) {
  throw new Error('Missing AWS_REGION environment variable.');
}