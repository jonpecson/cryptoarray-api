/**
 * Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('node-uuid');

module.exports = {

    attributes: {

        account_number: {
            type: "string",
            defaultsTo: function() {
                return uuid.v4();
            },
            uuidv4: true
        },

        status: {
            type: 'string',
            defaultsTo: 'Pending'
        },

        balance: {
            type: 'float',
            required: true,
            defaultsTo : 0
        },

        available_balance: {
            type: 'float',
            required: true,
            defaultsTo : 0
        },

        // Add a reference to customer / FK
        customer: {
            model: 'customer',
            defaultsTo : 0
        },

        // Add a reference to currency / FK
        currency: {
            model: 'currency',
            defaultsTo : 0
        },

        // One Account can have many Transactions
        transactions: {
            collection: 'transaction',
            via: 'account'
        },

    },
    beforeValidate: function(values, next) {
        values.uuid = uuid.v4();
        next();
    }
};