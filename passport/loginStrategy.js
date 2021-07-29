const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);

const hashFunction = require('./hashFunction');
const TABLE_NAME = "users";
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(async(email, password, done) => {

    //try putting the username in
    try {
        let users = await knex(TABLE_NAME).where({ email: email });

        //if user doesn't exist, then return false
        if (users.length == 0) {
            return done(null, false, {
                message: "Username not found"
            });
        }

        console.log('users in loginStrategy:', users)

        let user = users[0];

        // console.log('users0', user);
        console.log('user hashedpassword', user.password);

        //check their password
        let result = await hashFunction.checkPassword(password, user.hash);
        console.log('whether the passport matched with db?', result);

        //if something get back, return the user
        if (result) {
            return done(null, user);
        } else {
            //otherwise, send a message that incorrect credentials
            return done(null, false, {
                message: "incorrect credentials"
            });
        }
    } catch (err) {
        throw new Error(err);
    }
});