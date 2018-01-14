/**
 * CustomerController
 *
 * @description :: Server-side logic for managing customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    generatePassword: function(req, res) {
        API(Registration.generatePassword, req, res);
    },

    confirmPassword: function(req, res) {
        API(Registration.confirmPassword, req, res);
    },

    register: function(req, res) {
        API(Registration.registerCustomer, req, res);
    },

    resend: function(req, res) {
        API(Registration.resendEmailConfirmation, req, res);
    },

    activate: function(req, res) {
        API(Registration.activateCustomer, req, res);
    },

    login: function(req, res) {
        console.log(req.headers);


        var email = req.param('email');
        var password = req.param('password');

        verifyParams(res, email, password)

        // Customer.findOne({ email: email }).then(function(customer) {
        //     if (!customer) {
        //         return invalidEmailOrPassword(res);
        //     } else {
        //         // check if customer is already activated

        //         if (customer.activated) {
        //             signInUser(req, res, password, customer)
        //         } else {
        //             //Email customer
        //             ResponseService.json(401, res, "Please verify your account to continue.")
        //         }
        //     }

        // }).catch(function(err) {
        //     return invalidEmailOrPassword(res);
        // })
    },

};


function signInUser(req, res, password, customer) {
    Customer.comparePassword(password, customer).then(
        function(valid) {
            if (!valid) {
                return this.invalidEmailOrPassword();
            } else {
                var responseData = {
                    account_details: customer,
                    token: generateToken(customer.id)
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