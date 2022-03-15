require('dotenv').config();
const Client = require('./classes/Client');

const client = new Client();

client.init();