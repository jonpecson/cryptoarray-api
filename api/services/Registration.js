var Promise = require('bluebird'),
    promisify = Promise.promisify,
    mailer = require('nodemailer'),
    sendEmailActivationCode,
    transporter;

// Password generator
var generator = require('generate-password');

// Mailgun
var api_key = 'key-59e03ff1ee4cc411b045ce02aff4c71a';
var domain = 'mg.cooptavanza.net';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });



sendEmailActivationCode = function(options) {
    console.log(options);
    var url = options.url,
        subject = options.subject,
        email = options.email,
        password = options.password || '', // to be removed
        message = options.message;

    // Send Email
    var data = {
        from: 'Cooptavanza<support@cooptavanza.net>',
        to: email,
        subject: subject,
        html: message
    };

    mailgun.messages().send(data, function(error, body) {
        console.log("Email Response:", body);
    });


    return {
        url: url,
        password: password // to be removed
    }
};

module.exports = {
    sendEmailActivationCode: sendEmailActivationCode,

    // Customer

    currentCustomer: function(data, context) {
        return context.identity;
    },

    registerCustomer: function(data, context) {
        var password = data.password,
            email = data.email;

        return API.Model(Customer).create({
            // Create Customer
            name: data.name,
            birthdate: data.birthdate,
            gender: data.gender,
            phone_number: data.phone_number,
            street_address: data.street_address,
            state: data.state,
            city: data.city,
            zipcode: data.zipcode,
            email: data.email,
            password: password,
            // Add a reference to company
            activated: true
        }).then(function(customer) {
            // Generate JWT
            context.id = customer.id;
            context.email = customer.email;
            context.type = 'Customer';
            return Token.issue({ id: customer.id })
        })
        //.then(function(token) {
        //     var url = sails.config.security.server.url + sails.config.security.activation.customer + token;
        //     // Send Verification Link
        //     return sendEmailActivationCode({
        //         url: url,
        //         subject: 'Please verify your account',
        //         email: context.email,
        //         message: '<table bgcolor="#f0f0f0" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"> <tbody> <tr> <td align="center" bgcolor="#f0f0f0" style="background-color:#f0f0f0" valign="top"> <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="m_-3148058551993619661container" width="600"> <tbody> <tr> <td style="background: #92140C;"> <div>&nbsp;</div> </td> </tr> <tr> <td><span class="m_-3148058551993619661sg-image"><img height="48px" src="http://res.cloudinary.com/jonpecson/image/upload/c_scale,w_250/v1503478238/cooptavanza-logo-2_yjouls.png" style="margin:11px 26px;width: 250px;height: 60px;" width="250" class="CToWUd"></span></td> </tr> <tr> <td bgcolor="#ffffff" class="m_-3148058551993619661container-padding" style="background-color:#ffffff;padding-left:30px;padding-right:30px"> <div class="m_-3148058551993619661row m_-3148058551993619661top-padding20, m_-3148058551993619661vero-editable"> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p> </p> <p>Welcome to <span class="il">Cooptavanza</span><span class="il"></span>! Before you get started, please confirm your account by clicking the link below.</p>&nbsp; -<center> <p><b>Account Details</b></p> <p>username: <b>' + context.email + '</b></p> <p>password: <b>' + password + '</b></p> </center> <br> <center> <p><a href="' + url + '" rel="nofollow" style="margin: 0px;background-color: #CA1800;border-radius:5px;text-align:center;color:#ffffff;font-size: 17px;font-weight:bold;min-height:20px;padding:9px 15px;text-decoration:none;display:block;width:80%;" text="Confirm account" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=' + url + '&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNHYsTKL50hPBFnawcdRSwkOpQMbnQ">Confirm my account </a></p> </center>&nbsp; <!-- <p>or copy and paste your verification code to verify your account:</p> <center style="font-size:22px">Your Verification Code</center> <center style="font-size:32px;letter-spacing:4px;margin-top:10px"><strong>120604</strong></center> --> <p>&nbsp;</p> <p style="background-color:rgb(255,255,255)">If you believe an unauthorized person accessed your account,<br>please contact <a href="mailto:support@cooptavanza.net" target="_blank">support@<span class="il">cooptavanza</span>.<span class="il">net</span></a>.</p> </div> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p>Regards,<br><br>The <span class="il">Cooptavanza</span><span class="il"></span> Team<br><br><a href="http://twitter.com/Cooptavanza" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://twitter.com/Cooptavanza&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNEONOdZO1pZh3Xw0CUQT5u2R555Yg"><span class="m_-3148058551993619661sg-image"><img alt="Twitter" height="30px;" src="https://ci3.googleusercontent.com/proxy/S3C20xaD3FdqZ5AIIf7u6ZbSfDCxPOlwPhaqMTfhRvHyPYJmgGYBrUB780qDvkqhj5qMUS-oh94=s0-d-e1-ft#http://i61.tinypic.com/29vxthj.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> <a href="http://facebook.com/Cooptavanza-148060245780082" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.comurl?hl=en&amp;q=http://facebook.com/Cooptavanza-148060245780082&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNGGv5SLuh3Mi4CnrA4S_5zoPXChHQ"><span class="m_-3148058551993619661sg-image"><img alt="Facebook" height="30px;" src="https://ci6.googleusercontent.com/proxy/flIB6YbxwoPwtCSWefXl_HHECghkooiVyfuQTGU76YWjS5jduHbo4oULH9Qkf_524mpcAmOsDXQ=s0-d-e1-ft#http://i61.tinypic.com/2s9t11x.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> </p> </div> </div> </td> </tr> <tr> <td></td> </tr> </tbody> </table> <center> <p style="font-size:10px;color:#a3a3a3">© 2017, All rights reserved. Calle Quinta y Manuel Gonzalez, Del Edificio Aitza,Local 1, Santiago Veraguas, Republic of Panama</p> </center> </td> </tr> </tbody> </table>'
        //     });
        // });
    },

    activateCustomer: function(data, context, req, res) {

        let token = data.token;
        sails.log.debug(token);
        Token.verify(token, function(err, decoded) {
            if (err) return ResponseService.json(401, res, "Invalid Token!");
            var id = decoded.id;
            Customer.findOne(id).exec(function(err, customer) {
                if (err) {
                    sails.log.debug(err);
                    res.send(500, err);
                }
                if (!customer) {
                    sails.log.debug(err);
                    ResponseService.json(500, res, "Could not find the specified account.")
                } else {
                    customer.activated = true;
                    customer.activated_date = new Date();
                    customer.save(function(err) {
                        if (err) {
                            return res.serverError(err);
                        } else {
                            ResponseService.json(200, res, "Congratulations! Your account has been activated successfully");
                            sails.log.debug('Account has been activated successfully');

                            // Send Successfull Activation Email
                            return sendEmailActivationCode({
                                url: sails.config.security.login.url,
                                subject: 'You activated your account',
                                email: customer.email,
                                message: '<table bgcolor="#f0f0f0" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"> <tbody> <tr> <td align="center" bgcolor="#f0f0f0" style="background-color:#f0f0f0" valign="top"> <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="m_-3148058551993619661container" width="600"> <tbody> <tr> <td style="background: #92140C;"> <div>&nbsp;</div> </td> </tr> <tr> <td><span class="m_-3148058551993619661sg-image"><img height="48px" src="http://res.cloudinary.com/jonpecson/image/upload/c_scale,w_250/v1503478238/cooptavanza-logo-2_yjouls.png" style="margin:11px 26px;width: 250px;height: 60px;" width="250" class="CToWUd"></span></td> </tr> <tr> <td bgcolor="#ffffff" class="m_-3148058551993619661container-padding" style="background-color:#ffffff;padding-left:30px;padding-right:30px"> <div class="m_-3148058551993619661row m_-3148058551993619661top-padding20, m_-3148058551993619661vero-editable"> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p> </p> <p><span class="il"></span>Your account has been successfully activated. You can now log in to the system with your username and password.</p>&nbsp; <br> <br> <center> <p><a href="' + sails.config.security.login.url + '" rel="nofollow" style="margin: 0px;background-color: #CA1800;border-radius:5px;text-align:center;color:#ffffff;font-size: 17px;font-weight:bold;min-height:20px;padding:9px 15px;text-decoration:none;display:block;width:80%;" text="Confirm account" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=' + sails.config.security.login.url + '&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNHYsTKL50hPBFnawcdRSwkOpQMbnQ">Login</a></p> </center>&nbsp; <!-- <p>or copy and paste your verification code to verify your account:</p> <center style="font-size:22px">Your Verification Code</center> <center style="font-size:32px;letter-spacing:4px;margin-top:10px"><strong>120604</strong></center> --> <p>&nbsp;</p> <p style="background-color:rgb(255,255,255)">If you believe an unauthorized person accessed your account,<br>please contact <a href="mailto:support@cooptavanza.net" target="_blank">support@<span class="il">cooptavanza</span>.<span class="il">net</span></a>.</p> </div> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p>Regards,<br><br>The <span class="il">Cooptavanza</span><span class="il"></span> Team<br><br><a href="http://twitter.com/Cooptavanza" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://twitter.com/Cooptavanza&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNEONOdZO1pZh3Xw0CUQT5u2R555Yg"><span class="m_-3148058551993619661sg-image"><img alt="Twitter" height="30px;" src="https://ci3.googleusercontent.com/proxy/S3C20xaD3FdqZ5AIIf7u6ZbSfDCxPOlwPhaqMTfhRvHyPYJmgGYBrUB780qDvkqhj5qMUS-oh94=s0-d-e1-ft#http://i61.tinypic.com/29vxthj.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> <a href="http://facebook.com/Cooptavanza-148060245780082" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.comurl?hl=en&amp;q=http://facebook.com/Cooptavanza-148060245780082&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNGGv5SLuh3Mi4CnrA4S_5zoPXChHQ"><span class="m_-3148058551993619661sg-image"><img alt="Facebook" height="30px;" src="https://ci6.googleusercontent.com/proxy/flIB6YbxwoPwtCSWefXl_HHECghkooiVyfuQTGU76YWjS5jduHbo4oULH9Qkf_524mpcAmOsDXQ=s0-d-e1-ft#http://i61.tinypic.com/2s9t11x.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> </p> </div> </div> </td> </tr> <tr> <td></td> </tr> </tbody> </table> <center> <p style="font-size:10px;color:#a3a3a3">© 2017, All rights reserved. Calle Quinta y Manuel Gonzalez, Del Edificio Aitza,Local 1, Santiago Veraguas, Republic of Panama</p> </center> </td> </tr> </tbody> </table>'
                            });



                        }

                    }); //</Customer.save()>
                }

            });
        })

    },

    // User

    resendEmailConfirmation: function(data, context, req, res) {

        var password = generator.generate({
                length: 8,
                numbers: true
            }),
            email = data.email;

        Customer.update({ email: email }, { newPassword: password }).exec(function afterwards(err, updated) {

            if (err) {
                sails.log.debug(err);
                res.send(500, err);
            } else {
                ResponseService.json(200, res, "Please check your email for your new password.");

                var token = Token.issue({ id: updated[0].id });
                var url = sails.config.security.login.url;
                // Send Verification Link
                sendEmailActivationCode({
                    url: url,
                    subject: 'Your Cooptavanza password has been reset.',
                    email: updated[0].email,
                    message: '<table bgcolor="#f0f0f0" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"> <tbody> <tr> <td align="center" bgcolor="#f0f0f0" style="background-color:#f0f0f0" valign="top"> <table bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" class="m_-3148058551993619661container" width="600"> <tbody> <tr> <td style="background: #92140C;"> <div>&nbsp;</div> </td> </tr> <tr> <td><span class="m_-3148058551993619661sg-image"><img height="48px" src="http://res.cloudinary.com/jonpecson/image/upload/c_scale,w_250/v1503478238/cooptavanza-logo-2_yjouls.png" style="margin:11px 26px;width: 250px;height: 60px;" width="250" class="CToWUd"></span></td> </tr> <tr> <td bgcolor="#ffffff" class="m_-3148058551993619661container-padding" style="background-color:#ffffff;padding-left:30px;padding-right:30px"> <div class="m_-3148058551993619661row m_-3148058551993619661top-padding20, m_-3148058551993619661vero-editable"> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p> </p> <p>Your <span class="il">Cooptavanza</span><span class="il"></span>  password has been successfully reset, you can now login using your new password.</p>&nbsp; -<center> <p><b>Account Details</b></p> <p>username: <b>' + updated[0].email + '</b></p> <p>password: <b>' + password + '</b></p> </center> <br> <center> <p><a href="' + url + '" rel="nofollow" style="margin: 0px;background-color: #CA1800;border-radius:5px;text-align:center;color:#ffffff;font-size: 17px;font-weight:bold;min-height:20px;padding:9px 15px;text-decoration:none;display:block;width:80%;" text="Login" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=' + url + '&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNHYsTKL50hPBFnawcdRSwkOpQMbnQ">Login</a></p> </center>&nbsp; <!-- <p>or copy and paste your verification code to verify your account:</p> <center style="font-size:22px">Your Verification Code</center> <center style="font-size:32px;letter-spacing:4px;margin-top:10px"><strong>120604</strong></center> --> <p>&nbsp;</p> <p style="background-color:rgb(255,255,255)">If you believe an unauthorized person accessed your account,<br>please contact <a href="mailto:support@cooptavanza.net" target="_blank">support@<span class="il">cooptavanza</span>.<span class="il">net</span></a>.</p> </div> <div class="m_-3148058551993619661col-sm-12 m_-3148058551993619661col-md-6"> <p>Regards,<br><br>The <span class="il">Cooptavanza</span><span class="il"></span> Team<br><br><a href="http://twitter.com/Cooptavanza" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=en&amp;q=http://twitter.com/Cooptavanza&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNEONOdZO1pZh3Xw0CUQT5u2R555Yg"><span class="m_-3148058551993619661sg-image"><img alt="Twitter" height="30px;" src="https://ci3.googleusercontent.com/proxy/S3C20xaD3FdqZ5AIIf7u6ZbSfDCxPOlwPhaqMTfhRvHyPYJmgGYBrUB780qDvkqhj5qMUS-oh94=s0-d-e1-ft#http://i61.tinypic.com/29vxthj.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> <a href="http://facebook.com/Cooptavanza-148060245780082" style="word-wrap:break-word;color:#37b9e5;font-weight:normal;text-decoration:underline" target="_blank" data-saferedirecturl="https://www.google.comurl?hl=en&amp;q=http://facebook.com/Cooptavanza-148060245780082&amp;source=gmail&amp;ust=1503563464888000&amp;usg=AFQjCNGGv5SLuh3Mi4CnrA4S_5zoPXChHQ"><span class="m_-3148058551993619661sg-image"><img alt="Facebook" height="30px;" src="https://ci6.googleusercontent.com/proxy/flIB6YbxwoPwtCSWefXl_HHECghkooiVyfuQTGU76YWjS5jduHbo4oULH9Qkf_524mpcAmOsDXQ=s0-d-e1-ft#http://i61.tinypic.com/2s9t11x.png" style="border:none;outline:none;text-decoration:none;height:auto!important" width="30px;" class="CToWUd"></span></a> </p> </div> </div> </td> </tr> <tr> <td></td> </tr> </tbody> </table> <center> <p style="font-size:10px;color:#a3a3a3">© 2017, All rights reserved. Calle Quinta y Manuel Gonzalez, Del Edificio Aitza,Local 1, Santiago Veraguas, Republic of Panama</p> </center> </td> </tr> </tbody> </table>'
                });
            }

            console.log('Updated customer to have password ' + updated[0].password);
        });
    },

    registerUser: function(data, context) {

        return API.Model(User).create({
            // Create User
            // Personal Information
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            gender: data.gender,
            date_of_birth: data.date_of_birth,
            place_of_birth: data.place_of_birth,
            civil_status: data.civil_status,
            citizenship: data.citizenship,

            // Mother's Information
            mother_first_name: data.mother_first_name,
            mother_middle_name: data.mother_middle_name,
            mother_last_name: data.mother_last_name,

            // Billing Information
            address: data.address,
            country: data.country,
            state: data.state,
            city: data.city,
            zipcode: data.zipcode,
            telephone: data.telephone,
            mobile: data.mobile,

            // KYC
            face: data.face,

            // Add a reference to Role
            role: data.role,


            // Account Information
            username: data.username,
            password: data.password,
            activated: true // can be set to false
        }).then(function(user) {
            // Generate JWT
            context.id = user.id;
            context.username = user.username;
            context.type = 'User';
            return {
                message: 'User has created successfully.',
                token: Token.issue({ id: user.id }),
                data: user
            }

        });

    },


};