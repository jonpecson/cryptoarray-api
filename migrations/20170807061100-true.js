'use strict';
const async = require('async')

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db, cb) {
    // async.series([
    db.createCollection('product', function() {}),
        db.createCollection('customer', function() {}),
        db.createCollection('account', function() {}),
        db.createCollection('currency', function() {}),
        db.createCollection('department', function() {}),
        db.createCollection('designation', function() {}),
        db.createCollection('transaction', function() {})
        // ], cb)
};

exports.down = function(db) {
    async.series([
        db.dropCollection.bind(db, 'product'),
        db.dropCollection.bind(db, 'customer'),
        db.dropCollection.bind(db, 'account'),
        db.dropCollection.bind(db, 'currency'),
        db.dropCollection.bind(db, 'department'),
        db.dropCollection.bind(db, 'designation'),
        db.dropCollection.bind(db, 'transaction')
    ], cb)
};

exports._meta = {
    "version": 1
};