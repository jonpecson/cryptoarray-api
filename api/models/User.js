/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var uuid = require('node-uuid');
var Promise = require("bluebird");
var bcrypt = require("bcrypt");

module.exports = {

    attributes: {

        //Personal Information

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
            // required: true
        },
        telephone: {
            type: 'string',
            required: true
        },
        mobile: {
            type: 'string',
            required: true
        },


        // KYC

        face: {
            type: 'string',
            // required: true
        },


        // Add a reference to Role
        role: {
            model: 'role'
        },

        // Add a reference to Branch
        branch: {
            model: 'branch'
        },


        // Account Information

        username: {
            type: "string",
            required: true,
            unique: true
        },
        password: {
            type: "string",
            minLength: 6,
            protected: true,
            required: true,
            columnName: "encryptedPassword"
        },

        activated: {
            type: "boolean",
            defaultsTo: false
        },

        date_activated: {
            type: "date"
        },

        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    beforeCreate: function(values, cb) {
        bcrypt.hash(values.password, 10, function(err, hash) {
            if (err) return cb(err);
            values.password = hash;
            cb();
        });
    },

    beforeUpdate: function (values, cb) {
        if(values.newPassword){
          bcrypt.genSalt(10, function(err, salt) {
            if (err) return cb(err);
    
            bcrypt.hash(values.newPassword, salt, function(err, crypted) {
              if(err) return cb(err);
    
              delete values.newPassword;
              values.password = crypted;
              return cb();
            });
          });
        }
        else {
          return cb();
        }
      },

    comparePassword: function(password, user) {
        return new Promise(function(resolve, reject) {
            bcrypt.compare(password, user.password, function(err, match) {
                if (err) reject(err);

                if (match) {
                    resolve(true);
                } else {
                    reject(err);
                }
            })
        });
    }


};