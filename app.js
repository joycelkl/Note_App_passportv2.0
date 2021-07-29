//require all passport functions in folder
const passportFunctions = require('./passport');
const checkAuth = require('./checkAuth');

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const https = require('https');
const fs = require('fs');


const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");

const noteService = new NoteService(knex);

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars()); //{ defaultLayout: 'main' } no more needed

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true })); //change to true for any type and parsing the URL-encoded data with the in the qs library
app.use(express.json());
app.use(cookieParser());
app.use(
    // Creating a new session generates a new session id, stores that in a session cookie, and
    expressSession({
        secret: "secret",
        // save the user
        // if false, will not save session to browser
        resave: true,
        // if saveUninitialized is false, session object will not be stored in sesion store
        saveUninitialized: true,
    })
);

// Initialize Passport Function
app.use(passportFunctions.initialize());
// This line of code allows you to use sessions, so it means not only do you authorise your students with login you also need to access the user session.
app.use(passportFunctions.session());

app.use("/user", new NoteRouter(noteService).router());

app.get('/', (req, res) => {
    res.render('login', { layout: 'main' })
})

app.get('/login', (req, res) => {
    res.render('login', { layout: 'main' })
})

app.get('/signup', (req, res) => {
    res.render('signup', { layout: 'main' })
})

app.post('/signup', passportFunctions.authenticate('local-signup', {
    successRedirect: "/login",
    failureRedirect: "/error",
}))

app.post('/login', passportFunctions.authenticate('local-login', {
    successRedirect: '/user',
    failureRedirect: '/error',
}))

app.get('/auth/gmail', passportFunctions.authenticate('google', {
    scope: ['profile', 'email'],
}))

app.get('/auth/gmail/callback', passportFunctions.authenticate('google', {
    successRedirect: '/user',
    failureRedirect: '/error'
}))

app.get('/auth/facebook', passportFunctions.authenticate('facebook', {
    scope: ['email', 'public_profile'],
}))

app.get('/auth/facebook/callback', passportFunctions.authenticate('facebook', {
    successRedirect: '/user',
    failureRedirect: '/error',
}))

//list all note after login into app
app.get('/user', checkAuth.isLoggedIn, (req, res) => {

    console.log('auth detail', req.user.username);

    noteService.list(req.user.username).then((data) => {
        console.log(data, "in index js");
        return res.render("index", {
            user: req.user.username,
            note: data,
            layout: 'loggedin',
        });
    });
})

app.get('/error', (req, res) => {
    res.render('error', { layout: 'main' });
})

app.get('/logout', (req, res) => {
    req.logOut();
    res.render('login', { layout: 'main' });
})

const options = {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
}

https.createServer(options, app).listen(1227, () => {
    console.log('option', options)
    console.log("Listening to port 1227");
})