//Prefix: /book
//Initializing Express Router
const Router = require("express").Router();

//Datbase Establish
const BookModel = require("../../database/book");

/*
Route           /book
Description     to get all book
Access          PUBLIC
Method          GET
*/

Router.get("/", async (req, res) => {
    try {
        const getAllBooks = await BookModel.find();
        return res.json(getAllBooks);
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /book
Description     to get specific book by isbn
Access          PUBLIC
Parameter       isbn
Method          GET
*/

Router.get("/is/:isbn", async ( req, res ) => {
    try {
        const getSpecificBook = await BookModel.findOne({ ISBN : req.params.isbn});
        // const getSpecificBook = database.books.filter(
        //     (book) => book.ISBN === req.params.isbn
        // );
        if(!getSpecificBook){
            return res.json({ error: `No book found for the ISBN of ${req.params.isbn} `});
        }
        return res.json({ book: getSpecificBook });
    } catch (error) {
        return res.json({ error: error.message});
    }
});

/* 
Route           /c
Description     to get specific books bases on category
Access          PUBLIC
Parameter       category
Method          GET
*/

Router.get("/c/:category", async ( req, res ) => {
    try {
        const getSpecificBooks = await BookModel.findOne({category: req.params.category});
        // const getSpecificBooks = database.books.filter(
        //     (book) => book.category.includes(req.params.category) //includes is use because there is a array
        // );
    
        if(!getSpecificBooks){
            return res.json({ error: `No book found for the category of ${req.params.category} `});
        }
        return res.json({ book: getSpecificBooks });       
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author
Description     to get a list of book based on author 
Access          PUBLIC
Parameter       authorId
Method          GET
*/

Router.get("/author/:authorId", async (req, res) => {
    try {
        const getListBooksByAuthor = await BookModel.findOne({
            authors : req.params.authorId,
        });
    
        if(!getListBooksByAuthor){
            return res.json({ error: `No book found for the author of ${req.params.authorId} `});
        }
        return res.json({ books: getListBooksByAuthor });
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /book/new
Description     to add new book
Access          PUBLIC
Parameter       NONE
Method          POST
*/

Router.post("/new", async (req, res) => {
    try {
        const { newBook } = req.body; //newBook is object to post the data in postman
        await BookModel.create(newBook); //create the new book
        // database.books.push(newBook);
        return res.json({message: "book was added"});
    } catch (error) {
        return res.json({ error : error.message });
    }
});


/* 
Route           /book/update
Description     update title of book
Access          PUBLIC
Parameter       title
Method          PUT
*/

Router.put("/update/:isbn", async (req, res) => {
    try {
        const updatedBook = await BookModel.findOneAndUpdate(
            {
                ISBN: req.params.isbn, //to find the specific book by isbn
            },
            {
                title: req.body.bookTitle, //to update the data
            },
            {
                new: true,  //without this property mongodb return old value to get updated value we need to use new: true property        
            }
        );
        // database.books.forEach((book) => {
        //     if(book.ISBN == req.params.isbn){
        //         book.title = req.body.bookTitle;
        //         return;
        //     }
        // });
        return res.json({books:updatedBook });
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameter       isbn
Method          PUT
*/

Router.put("/author/update/:isbn", async (req,res) => {
    try {
        //update the book Database
        const updatedBooks = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            $addToSet: {
                authors: req.body.newAuthor,
            },
        },
        {
            new: true,
        }
    );
    // database.books.forEach((book) => {
    //     if(book.ISBN == req.params.isbn){
    //         return book.authors.push(req.body.newAuthor);
    //     }
    // });

        //update the author database
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor,
        },
        {
            $addToSet: {
                books: req.params.isbn,
            }
        },
        {
            new: true,
        }
    );
    // database.authors.forEach((author)=>{
    //     if(author.id == req.body.newAuthor){
    //         return author.books.push(req.params.isbn);
    //     }
    // });

        return res.json({books: updatedBooks, author: updatedAuthor, message: "new author was added"});
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Method          DELETE
*/

Router.delete("/delete/:isbn", async (req,res) => {
    try {
        const updatedBookDatabase = await BookModel.findOneAndDelete(
            {
            ISBN: req.params.isbn,
            },
        );
        // const updatedBookDatabase = database.books.filter(
        //     (book) => book.ISBN !== req.params.isbn
        // );
        // database.books = updatedBookDatabase;
        return res.json({books: updatedBookDatabase});  
    } catch (error) {
        return res.json({error: error.message});
    }
});


/* 
Route           /book/delete/author
Description     delete a author from book
Access          PUBLIC
Parameter       isbn, authorId
Method          DELETE
*/

Router.delete("/delete/author/:isbn/:authorId", async (req,res) => {
    try {
            //update the book database
        const updateBook = await BookModel.findOneAndUpdate(
            {
                ISBN : req.params.isbn,  
            },
            {
                $pull: {
                    authors: parseInt(req.params.authorId),
                }
            },
            {
                new: true,
            }
        );
        // database.books.forEach((book) =>{//for modifing the existing object
        //     if(book.ISBN === req.params.isbn){
        //         const newAuthorList = book.authors.filter(
        //             (author) => author !== parseInt(req.params.authorId)
        //         );
        //         book.authors = newAuthorList;
        //         return;
        //     }
        // });
    
        //update the author database
        const updatedAuthor = await AuthorModel.findOneAndUpdate(
            {
                id: parseInt(req.params.authorId),
            },
            {
                $pull: {
                    books: req.params.isbn,
                }
            },
            {
                new: true,
            }
        );
        // database.authors.forEach((author) =>{
        //     if(author.id === parseInt(req.params.authorId)){
        //         const newBooksList = author.books.filter(
        //             (book) => book !== req.params.isbn
        //         );
        //         author.books = newBooksList;
        //         return; 
        //     }
        // })
        return res.json({books: updateBook , authors: updatedAuthor});
    } catch (error) {
        return res.json({error: error.message});
    }
});

module.exports = Router; 