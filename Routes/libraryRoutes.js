// libraryRoutes.js
const express = require('express');
const router = express.Router();
const { addBook,getAllAuthors,getAuthorsAndBook,getAllBooks,getBooksWithAuthors,getAuthorbyId } = require('../Controllers/booksController');

// Book routes
router.get('/getAllBooks', getAllBooks);
router.get('/getBookWithAuthor', getBooksWithAuthors);
router.post('/addBook', addBook);
router.get('/getAllAuthors',getAllAuthors);
router.get('/getAuthorById',getAuthorbyId);
router.get('/getAuthorsWithBooks',getAuthorsAndBook);

                            
// // Create
// router.post('/CreateAuthor',createAuthor);

// // get
// router.get('/GetAllAuthors',getAllAuthors);

// router.delete('/DeleteAuthor',deleteAuthor);
// //update
// router.put('/updatAuthor',updateAuthor);




module.exports = router;
