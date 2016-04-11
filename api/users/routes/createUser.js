'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser;
const createToken = require('../util/token');

function hashPassword(password, callback) {
    // generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
       bcrypt.hash(password, salt, (error, hash) => {
          return callback(error, hash);
       });
    });
}

module.exports = {
    method: 'POST',
    path: '/api/users',
    config: {
        pre: [
            { method: verifyUniqueUser, assign: 'user' }
        ],
        handler: (req, res) => {
            let user = new User();
            user.email = req.payload.email;
            user.username = req.payload.username;
            user.admin = false;

            hashPassword(req.payload.password, (err, hash) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                user.password = hash;
                user.save((err, user) => {
                   if (err) {
                       throw Boom.badRequest(err);
                   }
                   // user saved successfully! issue a JWT
                    res({
                        id_token: createToken(user)
                    }).code(201);
                });
            })
        },
         // Validate the payload against the Joi schema
        validate: {
            payload: createUserSchema
        }
    }
}
