const userQueries = require('../database/userQueries');
const FacebookStrategy = require('passport-facebook').Strategy;
const facebookConfig = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: 'https://localhost:1227/auth/facebook/callback',
    profileFields: ['id', 'email', 'displayName']
}

function facebookCallback(accessToken, refreshToken, profile, done) {

    //original in passport-facebook tutorial
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //     return cb(err, user);
    //   });

    const user = { username: profile.displayName };

    //get user from database
    console.log('user information', profile);
    console.log('email', profile.emails[0].value)
    console.log('access token', accessToken);
    console.log('refresh token', refreshToken);

    userQueries
        .getByFacebookId(profile.id)
        .then((queryRow) => {
            if (queryRow.length === 0) {
                console.log('create new user in local database');
                return userQueries
                    .postFacebook(profile.displayName, profile.id, profile.emails[0].value)
                    .then((newId) => {
                        user.id = newId[0];
                        console.log('user facebook');
                        return done(null, user);
                    })
                    .catch((error) => {
                        done(error, false, {
                            message: "no user found"
                        });
                    });
            } else {
                //existing user and return user as an object
                user.id = queryRow[0].id;
                console.log('Facebook user:', user);
                return done(null, user);
            }
        })
        .catch((error) => {
            console.log('failed add facebook login user');
            return done(error, false, {
                message: 'cannot check database'
            });
        });
}

const facebook = new FacebookStrategy(facebookConfig, facebookCallback);

module.exports = {
    facebook: facebook
}