const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const users = express.Router();
// Database helpers
const {getUserById, getUserByEmail, getAllUsers} = require("../database/dbHandler");

const ensureAuthentication = (req, res, next) => {
    if (req.session.authenticated) {
        return next();
    } else {
        res.status(400).send({error: "Not authenticated"});
    }
};

users.get("/authenticate", (req, res) => {
    if (req.session) {
        res.status(200).send(req.session.user);
    } else {
        res.status(403).send({error: "Not authenticated"});
    }
});

users.post("/login", passport.authenticate("local", {failureMessage: {error: "Could not authenticate"}}), (req, res) => {
    getUserByEmail(req.body.username).then(user => {
        let userObject = {id: user.id, name: user.name, email: user.email};
        req.session.authenticated = true;
        req.session.user = userObject;
        res.status(200).send(userObject);
    }, err => {
        console.error(err);
        res.status(500).send({error: "Could not find user"});
    });
});

users.delete("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.status(400).send({error: "Unable to log out"});
            }
        });
    } else {
        res.end();
    }
});

users.get("/", ensureAuthentication, (req, res) => {
    if (req.session.userType === "admin") {
        getAllUsers().then(users => {
            res.send({users: users});
        }, err => {
            if (err === "No users found") {
                res.status(404).send({error: err});
            } else {
                res.status(500).send({error: "Could not complete request"});
            }
        });
    } else {
        res.status(403).send({error: "You are not permitted to view this page"});
    }
});

users.get("/:id", ensureAuthentication, (req, res) => {
    let id = req.params.id;
    if (req.session.userType === "admin" || req.session.user.id == id) {
        getUserById(id).then(user => {
            res.send({user: user});
        }, err => {
            console.error(err);
            res.status(500).send({error: "Could not retrieve user"});
        });
    } else {
        res.status(403).send({error: "You are not permitted to view this page"});
    }
});

module.exports = users;