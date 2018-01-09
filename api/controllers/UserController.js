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
        var username = req.param('username');
        var password = req.param('password');

        verifyParams(res, username, password)

        User.findOne({ username: username }).then(function(user) {
            if (!user) {
                return invalidUsernameOrPassword(res);
            } else {
                // check if customer is already activated

                if (user.activated) {
                    signInUser(req, res, password, user)
                } else {
                    ResponseService.json(200, res, "Please verify your account to continue.", { user_details: user })
                }
            }

        }).catch(function(err) {
            return invalidUsernameOrPassword(res);
        })
    },

};


function signInUser(req, res, password, user) {
    console.log(req.headers);
    User.comparePassword(password, user).then(
        function(valid) {
            if (!valid) {
                return this.invalidUsernameOrPassword();
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


function invalidUsernameOrPassword(res) {
    return ResponseService.json(401, res, "Invalid username or password")
};

function verifyParams(res, username, password) {
    if (!username || !password) {
        return ResponseService.json(401, res, "Username and password required")
    }
};


function generateToken(user_id) {
    return Token.issue({ id: user_id })
};