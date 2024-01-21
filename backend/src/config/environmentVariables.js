const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.SERVER_PORT) {
  throw new Error('Missing SERVER_PORT environment variable.');
}
