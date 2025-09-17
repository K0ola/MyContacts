const serverless = require('serverless-http');
const app = require('../../Server/app');

exports.handler = serverless(app, {
  binary: ['application/json'],
});
