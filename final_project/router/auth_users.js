console.log("AUTH ROUTER LOADED");

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

/**
 * Helper: check if user exists
 */
const isValid = (username) => {
    return users.some(user => user.username === username);
};

/**
 * Helper: validate credentials
 */
const authenticatedUser = (username, password) => {
    return users.some(
        user => user.username === username && user.password === password
    );
};

/**
 * TASK 5 - REGISTER
 */
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

/**
 * TASK 6 - LOGIN
 */
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Login failed" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = {
        accessToken,
        username
    };

    return res.status(200).json({
        message: "Login successful",
        token: accessToken
    });
});

/**
 * TASK 7 - ADD / UPDATE REVIEW
 */
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

/**
 * TASK 8 - DELETE REVIEW
 */
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review successfully deleted" });
    } else {
        return res.status(404).json({ message: "Review not found for this user" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;