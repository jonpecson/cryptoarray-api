/**
 * Customer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


// type
// Specifies the type of data that will be stored in this attribute. One of:
// string, text, integer, float, date, datetime, boolean
// binary, array, json, mediumtext, longtext, objectid

var uuid = require('node-uuid');
var Promise = require("bluebird");
var bcrypt = require("bcrypt");

var SALT_WORK_FACTOR = 10;

module.exports = {

    attributes: {

        //Personal Information
        customer_number: {
            type: "string",
            defaultsTo: function () {
                return uuid.v4();
            },
            uuidv4: true
        },

        first_name: {
            type: 'string',
            required: true
        },
        middle_name: {
            type: 'string'
        },
        last_name: {
            type: 'string',
            required: true
        },
        suffix: {
            type: 'string'
        },
        gender: {
            type: 'string',
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        date_of_birth: {
            type: 'date',
            required: true
        },
        place_of_birth: {
            type: 'string',
            required: true
        },

        civil_status: {
            type: 'string',
            required: true
        },

        citizenship: {
            type: 'string',
            required: true
        },

        // Mother's Information
        mother_first_name: {
            type: 'string'
        },
        mother_middle_name: {
            type: 'string'
        },
        mother_last_name: {
            type: 'string'
        },

        // Billing Information
        address: {
            type: 'string',
            required: true
        },

        country: {
            type: 'string',
            required: true
        },
        state: {
            type: 'string',
            required: true
        },
        city: {
            type: 'string',
            required: true
        },
        zipcode: {
            type: 'string',
            required: true
        },
        telephone: {
            type: 'string',
            required: true
        },
        mobile: {
            type: 'string',
            required: true
        },


        // Employment Information
        highest_educational_attainment: {
            type: 'string',
            required: true
        },
        company_name: {
            type: 'string',
        },
        employment_status: {
            type: 'string',
            enum: ['Part Time', 'Full Time', 'Freelance', 'Contructual'],
        },

        // KYC
        face: {
            type: 'string',
        },

        signature: {
            type: 'string',
        },


        photoid: {
            type: 'string',
        },

        // Dependents
        dependents: {
            type: 'json'
        },

        // Bank Accounts, Get Only
        // Add a reference to collection of ccounts
        accounts: {
            collection: 'account',
            via: 'customer'
        },

        // Transactions, Get Only
        // Add a reference to collection of transactions
        transactions: {
            collection: 'transaction',
            via: 'customer'
        },


        // Account Information
        email: {
            type: "email",
            required: true,
            unique: true
        },
        password: {
            type: "string",
            minLength: 6,
            protected: true,
            // required: true,
            columnName: "encryptedPassword"
        },

        activated: {
            type: "boolean",
            defaultsTo: false
        },

        date_activated: {
            type: "date"
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    // beforeCreate: function (values, cb) {
    //     bcrypt.hash(values.password, 10, function (err, hash) {
    //         if (err) return cb(err);
    //         values.password = hash;
    //         cb();
    //     });
    // },
    

    comparePassword: function (password, user) {
        return new Promise(function (resolve, reject) {
            bcrypt.compare(password, user.password, function (err, match) {
                if (err) reject(err);

                if (match) {
                    resolve(true);
                } else {
                    reject(err);
                }
            })
        });
    },

    beforeCreate: function (attrs, cb) {
        bcrypt.hash(attrs.password, SALT_WORK_FACTOR, function (err, hash) {
          attrs.password = hash;
          return cb();    
        });
      },
    
      beforeUpdate: function (attrs, cb) {
        if(attrs.newPassword){
          bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return cb(err);
    
            bcrypt.hash(attrs.newPassword, salt, function(err, crypted) {
              if(err) return cb(err);
    
              delete attrs.newPassword;
              attrs.password = crypted;
              return cb();
            });
          });
        }
        else {
          return cb();
        }
      }
};