const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");

const public_users = express.Router();

/**
 * TASK 1 - Get all books
 */
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

/**
 * TASK 2 - Get book by ISBN
 */
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

/**
 * TASK 3 - Get books by author
 */
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    let result = [];

    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === author) {
            result.push(books[key]);
        }
    });

    res.status(200).json(result);
});

/**
 * TASK 4 - Get books by title
 */
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    let result = [];

    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === title) {
            result.push(books[key]);
        }
    });

    res.status(200).json(result);
});

/**
 * TASK 5 - Get book reviews
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

/**
 * TASK 10 - Async get all books
 */
public_users.get('/async', async function (req, res) {
    try {
        const url = `${req.protocol}://${req.get('host')}/`;
        const response = await axios.get(url);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

/**
 * TASK 11 - Async get book by ISBN
 */
public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const url = `${req.protocol}://${req.get('host')}/`;
        const response = await axios.get(url);

        const book = response.data[isbn];

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving book by ISBN" });
    }
});

/**
 * TASK 12 - Async get books by author
 */
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const url = `${req.protocol}://${req.get('host')}/`;
        const response = await axios.get(url);

        let result = [];
        const allBooks = response.data;

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].author.toLowerCase() === author) {
                result.push(allBooks[key]);
            }
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by author" });
    }
});

/**
 * TASK 13 - Async get books by title
 */
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const url = `${req.protocol}://${req.get('host')}/`;
        const response = await axios.get(url);

        let result = [];
        const allBooks = response.data;

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].title.toLowerCase() === title) {
                result.push(allBooks[key]);
            }
        });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books by title" });
    }
});

module.exports.general = public_users;