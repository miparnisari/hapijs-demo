'use strict';

const Hapi = require('hapi'),
    Boom = require('boom'), //error handling
    mongoose = require('mongoose'),
    glob = require('glob'),
    path = require('path'),
    secret = require('./config');
const server = new Hapi.Server();

server.connection(
    { port: 3000 }
);

const dbUrl = 'mongodb://localhost:27017/hapi-app';

server.register(require('hapi-auth-jwt'), (err) => {
    server.auth.strategy('jwt', 'jwt', {
        key: secret,
        verifyOptions: { algorithms: ['HS256'] }
    });

    glob.sync('/api/**/routes/*.js', {
        root: __dirname
    }).forEach(file => {
        const route = require(file);
        server.route(route);
    });
});

server.start((err) => {
    if (err) {
        throw err;
    }

    mongoose.connect(dbUrl, {}, (err) => {
        if (err) {
            throw err;
        }
    });
});
