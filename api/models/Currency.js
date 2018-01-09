/**
 * Currency.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        country: {
            type: 'string',
            required: true
        },

        currency: {
            type: 'string',
            required: true
        },

        code: {
            type: 'string',
            required: true
        },

        symbol: {
            type: 'string',
            required: true
        }
    }
};