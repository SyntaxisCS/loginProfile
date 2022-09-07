const express = require("express");
const session = require("express-session");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../.env")});
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const pg = require("pg");
const cors = require("cors");
const pgSession = require("connect-pg-simple")(session);
const bodyParser = require("body-parser");
const app = express.Router();

app.use(express.static("../frontend"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(cors({
    origin: ["localhost", "https://syntaxiscs.com", "https://loginprofile.syntaxiscs.com"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    credentials: true
}));

const {getUserByEmail, getUserById} = require("./api/database/dbHandler");

const pgPool = new pg.Pool({
    user: process.env.LPpgUser,
    host: process.env.pgHost,
    database: process.env.LPpgDB,
    password: process.env.LPpgPassword,
    port: process.env.pgPort
});

app.use(session({
    secret: "R560P",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pgPool,
        tableName: process.env.pgUserSessions
    }),
    cookie: {
        maxAge: 43200000
    }
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy((username, password, done) => {
    getUserByEmail(username).then(user => {
        bcrypt.compare(password, user.password).then(result => {
            if (result) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Incorrect password"});
            }
        }, err => {
            return done(err);
        });
    }, err => {
        return done(err);
    });
}));

passport.serializeUser((user, done) => {
    done(null, {id:user.id, email: user.email});
});

passport.deserializeUser((user, done) => {
    getUserById(user.id).then(response => {
        done(null, user);
    }, err => {
        done(err);
    });
});

app.get("/health", (req, res) => {
    res.send({status: "Ok!"});
});

const userRouter = require("./api/users/users");
app.use("/users", userRouter);

module.exports = app;