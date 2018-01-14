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

        email: {
            type: 'string',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 6,
            protected: true,
            required: true,
            columnName: "encryptedPassword"
        },
        name: {
            type: 'string',
            required: true
        },
        birthdate: {
            type: 'date',
            required: true
        },
        gender: {
            type: 'string',
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        phone_number: {
            type: 'string',
            required: true
        },

        street_address: {
            type: 'string',
        },

        state: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
        zipcode: {
            type: 'string',
        },
        activated: {
            type: 'boolean',
            required: true,
            defaultsTo: true
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