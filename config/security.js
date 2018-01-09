module.exports.security = {
    server: {
        url: 'https://coop-cbs-api.herokuapp.com' // production
            // url: 'https://localhost:1337'

    },
    activation: {
        customer: '/account/activate?token=',
        user: '/user/activate?token=',
    },
    login: {
        url: 'https://www.cooptavanza.net'
    },

    confirmPassword: '/confirm/password?token='

};