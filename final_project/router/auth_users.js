const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  // return res.status(300).json({ message: "Yet to be implemented" });
  const { username, password } = req.body;

  // Check for missing fields
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check credentials
  if (!authenticatedUser(username, password)) {
    return res
      .status(401)
      .json({ message: "Invalid login. Check username and password." });
  }

  // Create JWT token
  const accessToken = jwt.sign(
    { username },
    "access", // secret key (should be in env in real apps)
    { expiresIn: "1h" }
  );

  // Save token in session
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "User successfully logged in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({ message: "Yet to be implemented" });
  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session?.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({
      message: "Review text is required as a query param (?review=...)",
    });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res
    .status(200)
    .json({ message: "Review added/updated successfully!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews || !book.reviews[username]) {
    return res
      .status(404)
      .json({ message: "No review found for this user to delete" });
  }

  // Delete the user's review
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
