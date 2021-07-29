const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

const hashFunction = require('./hashFunction');
const TABLE_NAME = 'users';
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async(req, email, password, done) => {
    console.log('sign-up');
    console.log('username', req.body.username)
    console.log('email', email);
    console.log('password', password);

    try {
        //check whether user already exist
        let users = await knex(TABLE_NAME).where({ email: email });

        //if user exists
        if (users.length > 0) {
            //return false as user already exists
            console.log('local-signUp check, user exist')
            return done(null, false, {
                message: 'user already exists'
            });
        }

        //otherwise, hash the password
        let hashedPassword = await hashFunction.hashPassword(password);
        const newUser = {
            username: req.body.username,
            email: email,
            hash: hashedPassword,
        };

        //insert new user to database and get the id
        let userId = await knex(TABLE_NAME).insert(newUser).returning('id');
        console.log('userID', userId);

        //assign that id to the user
        newUser.id = userId[0];
        console.log('newUser:', newUser);

        //done - pass back the user object
        done(null, newUser);

    } catch (error) {
        throw new Error(error);
    }
});