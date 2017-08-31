const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config');
const userService = require('../services/account_service');
module.exports = function (passport) {
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.secretkey;
    // opts.issuer = "accounts.examplesoft.com";
    // opts.audience = "yoursite.net";
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        var query = [{
            path: 'profileImages',
            match: {
                IsActive: true
            }
        }, {
            path: 'posts',
            match: {
                IsActive: true
            }
        }, {
            path: 'coverImages',
            match: {
                IsActive: true
            }
        }];

        userService.getOneById(jwt_payload._doc._id,query,{}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account 
            }
        });
    }));
}