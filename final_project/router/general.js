const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
    .status(400)
      .json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  
  //return res.status(300).json({message: "Yet to be implemented"});
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const author = req.params.author;
  let matchingBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  
  const title = req.params.title;
  let matchingBooks = [];
  
  for (let key in books) {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});





// TASK 10 - Async version
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.status(200).send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

// TASK 11 - Async version
public_users.get("/async/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "Book not found by ISBN" });
  }
});
// TASK 12 - Async version
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for this author" });
  }
});
const axios = require("axios");
// TASK 13 - Async version
public_users.get("/async/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).json(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found with this title" });
  }
});

module.exports.general = public_users;
