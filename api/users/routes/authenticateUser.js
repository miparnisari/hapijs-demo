'use strict';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../util/userFunctions').verifyCredentials;
const createToken = require('../util/token');

module.exports = {
    method: 'POST',
    path: '/api/users/authenticate',
    config: {
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        handler: (req, res) => {
            // if the user's password is correct, we can issue a token.
            // if it was inccorect, the error will bubble up from the pre method
            res({
                id_token: createToken(req.pre.user)
            }).code(201);
        },
        validate: {
            payload: authenticateUserSchema
        }
    }
}
