'use strict';

const User = require('../model/User');
const Boom = require('boom');

module.exports = {
    method: 'GET',
    path: '/api/users',
    config: {
        handler: (req, res) => {
            User.find()
                .select('-password -__v') // Deselect the password and version fields
                .exec((err, users) => {
                   if (err) {
                       throw Boom.badRequest(err);
                   }
                   if (!users.length) {
                       throw Boom.notFound('No users found');
                   }
                   res(users);
                });
        },
        // Add authentication to this route
        // The user must have a scope of `admin`
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    }
}
