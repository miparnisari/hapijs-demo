'use strict';

const Boom = require('boom');
const User = require('../model/User');

function verifyUniqueUser(req, res) {
    // Find an entry from the database that matches either the email or username
    User.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    }, (err, user) => {
        if (user) {
            if (user.username === req.payload.username) {
                res(Boom.badRequest('Username taken'));
            }
            if (user.email === req.payload.email) {
                res(Boom.badRequest('Email taken'));
            }
        }
        // If everything checks out, send the payload through
        // to the route handler
        res(req.payload);
    });
}

function verifyCredentials(req, res) {
    const password = req.payload.password;
    // Find an entry from the database that matches either the email or username
    User.findOne({
        $or: [
            { email: req.payload.email },
            { username: req.payload.username }
        ]
    }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, isValid) => {
                if (isValid) {
                    res(user);
                } else {
                    res(Boom.badRequest('Incorrect password'));
                }
            });
        } else {
            res(Boom.badRequest('Incorrect username or email'));
        }
    });
}

module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    verifyCredentials: verifyCredentials
}
