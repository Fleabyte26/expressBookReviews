const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");

const public_users = express.Router();

/**
 * TASK 10
 * Get the list of all books using async/await + Axios
 */
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

/**
 * TASK 11
 * Get book details by ISBN using async/await + Axios
 */
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get('http://localhost:5000/');
        const book = response.data[isbn];

        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book by ISBN" });
    }
});

/**
 * TASK 12
 * Get books by author using async/await + Axios
 */
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;
        let result = [];

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].author.toLowerCase() === author) {
                result.push(allBooks[key]);
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author" });
    }
});

/**
 * TASK 13
 * Get books by title using async/await + Axios
 */
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;
        let result = [];

        Object.keys(allBooks).forEach(key => {
            if (allBooks[key].title.toLowerCase() === title) {
                result.push(allBooks[key]);
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title" });
    }
});

/**
 * Existing route — do NOT change
 * Get book review by ISBN
 */
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
