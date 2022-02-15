const express = require("express");
const accountsRoute = require('./accounts/accounts-router')
const server = express();

server.use(express.json());
server.use('/api/accounts', accountsRoute)
module.exports = server;
