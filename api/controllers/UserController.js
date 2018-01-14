/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    register: function(req, res) {
        API(Registration.registerUser, req, res);
    },

    login: function(req, res) {
        console.log(req.params.all())
        var email = req.param('email');
        var password = req.param('password');

        verifyParams(res, email, password)

        Customer.findOne({ email: email }).then(function(user) {
            if (!user) {
                return invalidEmailOrPassword(res);
            } else {
                // check if customer is already activated

                if (user.activated) {
                    signInUser(req, res, password, user)
                } else {
                    ResponseService.json(200, res, "Please verify your account to continue.", { user_details: user })
                }
            }

        }).catch(function(err) {
            return invalidEmailOrPassword(res);
        })
    },

};


function signInUser(req, res, password, user) {
    console.log(req.headers);
    User.comparePassword(password, user).then(
        function(valid) {
            if (!valid) {
                return this.invalidEmailOrPassword();
            } else {
                var responseData = {
                    account_details: user,
                    token: generateToken(user.id)
                }
                return ResponseService.json(200, res, "Successfully signed in", responseData)
            }
        }
    ).catch(function(err) {
        return ResponseService.json(403, res, "Forbidden")
    })
};


function invalidEmailOrPassword(res) {
    return ResponseService.json(401, res, "Invalid email or password")
};

function verifyParams(res, email, password) {
    if (!email || !password) {
        return ResponseService.json(401, res, "Email and password required")
    }
};


function generateToken(user_id) {
    return Token.issue({ id: user_id })
};