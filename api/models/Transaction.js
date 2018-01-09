/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        account: {
            model: 'account'
        },

        customer: {
            model: 'customer'
        },

        effective_date: {
            type: 'date',
            required: true
        },

        type: {
            type: 'string',
            required: true
        },

        description: {
            type: 'string',
            required: true
        },

        amount: {
            type: 'float',
            required: true
        },


        account_type: {
            type: 'string', // Personal or Business
            required: true
        }

    }
};