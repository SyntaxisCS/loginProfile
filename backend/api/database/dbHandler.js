const {Client} = require("pg");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../../../../.env")});

const DB = new Client({
    user: process.env.LPpgUser,
    host: process.env.pgHost,
    database: process.env.LPpgDB,
    password: process.env.LPpgPassword,
    port: process.env.pgPort
});

DB.connect();

// Users
const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
        let query = {
            name: "getUserById",
            text: "SELECT * FROM users WHERE id = $1",
            values: [id]
        };
        DB.query(query).then(response => {
            if (response.rows[0]) {
                resolve(response.rows[0]);
            } else {
                reject("User not found");
            }
        }, err => {
            reject(err);
        });
    });
};

const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        let query = {
            name: "getUserByEmail",
            text: "SELECT * FROM users WHERE email = $1",
            values: [email]
        };
        DB.query(query).then(response => {
            if (response.rows[0]) {
                resolve(response.rows[0]);
            } else {
                reject("User not found");
            }
        }, err => {
            reject(err);
        });
    });
};

const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        let query = {
            name: "getAllUsers",
            text: "SELECT * FROM users"
        };
        DB.query(query).then(response => {
            if (response.rows) {
                resolve(response.rows);
            } else {
                reject("No users found");
            }
        }, err => {
            reject(err);
        });
    });
};

const authenticate = async (email, password) => {
    return new Promise((resolve, reject) => {
        getUserByEmail(email).then(user => {
            bcrypt.compare(password, user.password).then(result => {
                if (result) {
                    resolve("Authenticated");
                } else {
                    reject("Incorrect password");
                }
            });
        }, err => {
            reject("Incorrect username");
        });
    });
};

module.exports = {getUserById, getUserByEmail, getAllUsers, authenticate};