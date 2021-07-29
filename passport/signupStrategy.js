const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

const hashFunction = require('./hashFunction');
const TABLE_NAME = 'users';
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(async(username, email, password, done) => {
    console.log('sign-up');
    console.log('username', username)
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
            username: username,
            email: email,
            hash: hashedPassword,
        };

        const user = { username: username }

        //insert new user to database and get the id
        let userId = await knex(TABLE_NAME).insert(newUser).returning('id');
        console.log('userID', userId)

        //assign that id to the user
        user.id = userId[0];
        console.log('user:', user);

        //done - pass back the user object
        done(null, user);
    } catch (error) {
        throw new Error(error);
    }
});