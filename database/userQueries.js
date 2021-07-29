const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);
const hashFunction = require('../passport/hashFunction');
const TABLE_NAME = "users";


//adding Facebook login user into database (no password)
function postFacebook(username, facebookId, email) {
    return knex(TABLE_NAME)
        .insert({
            username: username,
            email: email,
            facebook_id: facebookId,
        })
        .returning('id');
}

//get Facebook's user id in local database
function getByFacebookId(facebookId) {
    return knex(TABLE_NAME).where({ facebook_id: facebookId });
}

//adding Google login user into database (no password)
function postGmail(username, email, gmailId) {
    return knex(TABLE_NAME)
        .insert({
            username: username,
            email: email,
            gmail_id: gmailId,
        })
        .returning('id');
}

// get Google's user id in local database
function getByGmailId(gmailId) {
    console.log(gmailId)
    return knex(TABLE_NAME).where({ gmail_id: gmailId });
}

// get id for deserialize function
function getById(id) {
    return knex(TABLE_NAME).select('id', 'username').where({ id: id });
}

//check whether the user already exists in the database
function userExist(username) {
    return knex(TABLE_NAME)
        .count('id as n')
        .where({ username: username })
        .then((count) => {
            console.log('count in userQueries', count)
            return count[0].n > 0
        });
}

// to be clerify where to apply this function
function createUser(username, password) {
    return userExist(username)
        .then((exists) => {
            if (exists) {
                return Promise.reject(new Error('user exists!'));
            }
        })
        .then(() => hashFunction.hashPassword(password))
        .then((hash) => {
            return knex(TABLE_NAME).insert({
                username: username,
                // password: password, <--didn't find this col in database
                hash: hash
            })
        });
}

function verify(username, password) {
    getByUsername(username)
        .then((user) => {
            let getUser = user[0];
            return hashFunction.checkPassword(password, getUser.hash);
        })
        .then((auth) => {
            console.log('Authorized', auth);
            return auth;
        })
        .then((auth) => {
            if (auth === true) {
                console.log('verified');
                return getByUsername(username);
            } else {
                console.log('not verified');
                return false;
            }
        })
        .then((user) => {
            console.log(user);
            return user[0];
        })
        .catch((error) => {
            console.error(error);
        })
}

function getByUsername(username) {
    return knex(TABLE_NAME)
        .select('id', 'username', 'gmail_id', 'facebook_id', 'hash')
        .where({ username: username });
}

module.exports = {
    postFacebook: postFacebook,
    postGmail: postGmail,
    getByFacebookId: getByFacebookId,
    getByGmailId: getByGmailId,
    getById: getById
}