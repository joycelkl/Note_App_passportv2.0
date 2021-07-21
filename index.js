const express = require("express");
const app = express();
const basicAuth = require("express-basic-auth");
const handlebars = require('express-handlebars');
const authFunction = require('./auth');
const path = require('path');

const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const NoteService = require("./Service/NoteService");
const NoteRouter = require("./Router/NoteRouter");

const noteService = new NoteService(knex);

app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ defaultLayout: 'main' }));

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
    basicAuth({
        authorizeAsync: true,
        challenge: true,
        realm: "Wk3 NoteApp",
        authorizer: authFunction(knex),
    })
);

//Handle initial get request using this middleware which just console.logs Getting.
app.get('/', (req, res, next) => {
    console.log('getting ready');
    next();
});

app.get('/', (req, res) => {
    console.log(req.auth.user, req.auth.password);

    noteService.list(req.auth.user).then((data) => {
        console.log(data, "in index js");
        return res.render("index", {
            user: req.auth.user,
            note: data,
        });
    })
})

app.use("/api/info", new NoteRouter(noteService).router());


// Responsible for sending our index page back to our user.
//**************NEED TO BUILD UP NOTESERVCE*************//
// app.get("/", (req, res) => {
//     console.log(req.auth.user, req.auth.password);
//     noteService.list(req.auth.user).then((data) => {
//         console.log(data);
//         res.render("index", {
//             user: req.auth.user,
//             notes: data,
//         });
//     });
// });

// Getting new user data from frontend
// app.get('/insertUsers', (req, res) => {
//     console.log(req.body.insertUsers)
//     let query = knex.insert({ name: 'username', password: 'password' })
//         .into('users');

//     query.then((query) => {
//         console.log(query);
//         res.send("success");
//     });
// });

// sending user data to frontend
app.get('/users', (req, res) => {
    let query = knex('users').select('*');
    query.then((data) => {
        res.send(data);
    });
});

app.listen(1227, () => {
    console.log("Listening to port 1227")
});