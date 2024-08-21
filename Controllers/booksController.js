const { Books, Author } = require('../models')
const addBook = async (req, res) => {
    try {

        const newBook = req.body;
        const b = await Books.create(newBook);
        return res.status(201).json("Book Added Successfully");

    }
    catch (err) {
        return res.status(500).json({ err: err.message });
    }
}
const getAllAuthors = async (req, res) => {
    const authors = await Author.findAll();
    return res.status(200).json(authors);
}
const getAuthorsAndBook = async (req, res) => {
    const authors = await Author.findAll({ include: Books });
    return res.status(200).json(authors);
}
const getAuthorbyId = async (req, res) => {
    const authors = await Author.findAll({ where: { id: req.query.id }, include: Books });
    return res.status(200).json(authors);
}
const getAllBooks = async (req, res) => {
    const fetched_books = await Books.findAll();
    return res.status(200).json(fetched_books);
}
const getBooksWithAuthors = async (req, res) => {
    const book_with_authors = await Books.findAll({ include: Author })
    return res.status(200).json(book_with_authors);
}





module.exports = { addBook, getAllAuthors, getAuthorsAndBook, getAllBooks, getBooksWithAuthors, getAuthorbyId };