/**
 * Main application file
 */

'use strict';

var express = require('express');

var path = require('path');
var config = {
    port: 3000,
};


// Setup server
var app = express();
var server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '/client')));
app.route('/*')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname, '/client', 'index.html'));
    });
// Start server
server.listen(config.port, config.ip, function () {
    console.log('Express server listening on %d ', config.port);
});

// Expose app
var exports = module.exports = app;