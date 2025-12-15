const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can register
regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!users.some(user => user.username === username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(409).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user." });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

        req.session.authorization = {
            accessToken,
            username
        };

        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review successfully added/updated" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn] && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review successfully deleted" });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
