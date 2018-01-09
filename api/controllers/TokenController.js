/**
 * TokenController
 *
 * @description :: Server-side logic for managing tokens
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var authenticator = require('authenticator');

var key = "JohnAnthonyPecson"; // authenticator.generateKey();
// "acqo ua72 d3yf a4e5 uorx ztkh j2xl 3wiz" 

module.exports = {

    generate: function(req, res) {
        var key = req.body.device_id;
        if (key) {
            var token = authenticator.generateToken(key);
            res.send({
                device_id: key,
                otp: token,
                message: "new token has been generated."
            })
        } else {
            res.send({
                device_id: 'null',
                otp: 'null',
                message: "no device id provided."
            })
        }

    },

    verify: function(req, res) {
        var result = {
            valid: false,
            message: "Invalid token."
        }

        if (authenticator.verifyToken(req.body.key, req.body.token)) {
            result.valid = true;
            result.message = "Your token is valid.";

        }

        res.json(result);
    },
};