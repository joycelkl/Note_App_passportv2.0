const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const userQueries = require('../database/userQueries');

const googleConfig = {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: 'https://localhost:1227/auth/gmail/callback'
}

function googleCallback(accessToken, refreshToken, profile, done) {

    // original tutorial in passport-google-oauth20
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    // return cb(err, user);});

    console.log('google profile:', profile)
    console.log('profile ID', profile.id);
    console.log('username', profile.displayName);
    console.log('email', profile.emails[0].value)

    console.log('access token', accessToken);
    console.log('refresh token', refreshToken);

    const user = { username: profile.displayName }

    userQueries
        .getByGmailId(profile.id)
        .then((queryRow) => {
            console.log('queryRow', queryRow)
            if (queryRow.length === 0) {
                // google login is not existing user
                console.log("create new google login user in local");
                return userQueries
                    .postGmail(profile.displayName, profile.emails[0].value, profile.id)
                    .then((newId) => {
                        console.log('new user id', newId)
                        user.id = newId[0];
                        console.log('posted user:', user);
                        return done(null, user);
                    })
                    .catch((error) => {
                        done(error, false, {
                            message: 'cannot add user'
                        });
                    });
            } else {
                // google login is existing user
                user.id = queryRow[0].id;
                return done(null, user);
            }
        })
        .catch((error) => {
            return done(error, false, {
                message: 'connot access database'
            });
        });
}

const google = new GoogleStrategy(googleConfig, googleCallback);

module.exports = { google: google };