/**
 * CBS_Account.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        name: {
            type: 'string'
        },

        code: {
            type: 'string'
        },

        description: {
            type: 'string'
        },

        account_classification: {
            model: 'cbs_account_classification'
        },

    }
};