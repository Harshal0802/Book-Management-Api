require("dotenv").config();
//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/index");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initializing express
const bookmac = express();

//configurations
bookmac.use(express.json());

//Establish Database Connection
mongoose
    .connect(process.env.MONGO_URL,
)
.then(() => console.log("connection establish"));
 
/*
Route           /
Description     to get all book
Access          PUBLIC
Method          GET
*/
bookmac.get("/", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
});

/* 
Route           /
Description     to get specific book by isbn
Access          PUBLIC
Parameter       isbn
Method          GET
*/
bookmac.get("/is/:isbn", async ( req, res ) => {
    const getSpecificBook = await BookModel.findOne({ ISBN : req.params.isbn});

    // const getSpecificBook = database.books.filter(
    //     (book) => book.ISBN === req.params.isbn
    // );

    if(!getSpecificBook){
        return res.json({ error: `No book found for the ISBN of ${req.params.isbn} `});
    }
    return res.json({ book: getSpecificBook });
});

/* 
Route           /c
Description     to get specific books bases on category
Access          PUBLIC
Parameter       category
Method          GET
*/

bookmac.get("/c/:category", async ( req, res ) => {
    const getSpecificBooks = await BookModel.findOne({category: req.params.category});
    // const getSpecificBooks = database.books.filter(
    //     (book) => book.category.includes(req.params.category) //includes is use because there is a array
    // );

    if(!getSpecificBooks){
        return res.json({ error: `No book found for the category of ${req.params.category} `});
    }
    return res.json({ book: getSpecificBooks });
});

/* 
Route           /a
Description     to get a list of book based on author 
Access          PUBLIC
Parameter       authorId
Method          GET
*/

bookmac.get("/a/:authorId", async (req, res) => {
    const getListBooksByAuthor = await BookModel.findOne({
        authors : req.params.authorId,
    });

    if(!getListBooksByAuthor){
        return res.json({ error: `No book found for the author of ${req.params.authorId} `});
    }
    return res.json({ books: getListBooksByAuthor });
});


/* 
Route           /author
Description     to get all authors
Access          PUBLIC
Parameter       NONE
Method          GET
*/

bookmac.get("/author", async (req, res) => {
    const getAllAuthors = await AuthorModel.find(); //find() are using for all authors
    return res.json(getAllAuthors);
});

/* 
Route           /aut
Description     to get specific author
Access          PUBLIC
Parameter       id
Method          GET
*/

bookmac.get("/aut/:authorid", async ( req, res ) => {
    const getSpecificAuthor = await AuthorModel.findOne({author: req.params.authorid});
    // const getSpecificAuthor = database.authors.filter(
    //     (author) => author.id === parseInt(req.params.authorid)
    // );

    if(!getSpecificAuthor){
        return res.json({ error: `No book found for the Author_id of ${req.params.authorid} `});
    }
    return res.json({ book: getSpecificAuthor });
});

/* 
Route           /author
Description     to get list of author based on a book's ISBN
Access          PUBLIC
Parameter       isbn
Method          GET
*/

bookmac.get("/author/:isbn", async (req, res) => {
    const getSpecificAuthors = await AuthorModel.find({author: req.params.isbn});
    // const getSpecificAuthors = database.authors.filter(
    //     (author) => author.books.includes(req.params.isbn)
    // );

    if(!getSpecificAuthors){
        return res.json({error: `No author found for the book ${req.params.isbn}`});
    }

    return res.json({authors: getSpecificAuthors});
});

/* 
Route           /pub
Description     to get all publications
Access          PUBLIC
Parameter       NONE
Method          GET
*/

bookmac.get("/pub", async (req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json({publications: getAllPublication});
});

/* 
Route           /pub
Description     to get specific publications
Access          PUBLIC
Parameter       id
Method          GET
*/

bookmac.get("/pub/:id", async (req, res) => {
    const getSpecificPublication = await PublicationModel.findOne({ Publication: req.params.id });
    // const getSpecificPublication = database.publications.filter(
    //     (pub) => pub.id == req.params.id
    // );

    if(!getSpecificPublication){
        return res.json({error: `No Publcation found of the pub_id ${req.params.id}`});
    }
    return res.json({publication: getSpecificPublication});
})

/* 
Route           /pub
Description     to get list of publications based on a book
Access          PUBLIC
Parameter       isbn
Method          GET
*/

bookmac.get("/publication/:isbn", async (req, res) => {
    const getPublicationList = await PublicationModel.find({ publicaton: req.params.isbn});
    // const getPublicationList = database.publications.filter(
    //     (book) => book.books.includes(req.params.isbn)
    // );
    
    if(!getPublicationList){
        return res.json({error: `No Publication found for the book's ISBN ${req.params.isbn}`});
    }

    return res.json({publication: getPublicationList});
})

/* 
Route           /book/new
Description     to add new book
Access          PUBLIC
Parameter       NONE
Method          POST
*/

bookmac.post("/book/new", async (req, res) => {
    const { newBook } = req.body;

    BookModel.create(newBook);
    // database.books.push(newBook);

    // return res.json({ books: database.books, message: "book was added"});
});

/* 
Route           /author/new
Description     to add new author
Access          PUBLIC
Parameter       NONE
Method          POST
*/

bookmac.post("/author/new", (req,res) => {
    const { newAuthor } = req.body;

    // database.authors.push(newAuthor);
    AuthorModel.create(newAuthor);

    return res.json({message: "Author was added"});
});

/* 
Route           /publication/new
Description     to add new publication
Access          PUBLIC
Parameter       NONE
Method          POST
*/

bookmac.post("/publication/new", (req, res) => {
    const { newPublication } = req.body;

    PublicationModel.create(newPublication);
    // database.publications.push(newPublication);

    return res.json({message: "publication was added"});
});

/* 
Route           /book/update
Description     update title of book
Access          PUBLIC
Parameter       title
Method          PUT
*/

bookmac.put("/book/update/:isbn", async (req, res) => {
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
});

/* 
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameter       isbn
Method          PUT
*/

bookmac.put("/book/author/update/:isbn", async (req,res) => {
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
});

/* 
Route           /author/update
Description     update the name of author
Access          PUBLIC
Parameter       id
Method          PUT
*/

bookmac.put("/author/update/:id", async (req,res) => {
    const updateAuthorName = await AuthorModel.findOneAndUpdate(
        {
            id : req.params.id,
        },
        {
            name : req.body.newName,
        },
        {
            new: true,
        }
    );
    // database.authors.forEach((author) => {
    //     if(author.id == req.params.id){
    //         author.name = req.body.authorName;
    //         return;
    //     }
    // });
    return res.json({author: updateAuthorName, message: "author name is updated"});
});

/* 
Route           /publication/update
Description     update the name of publication
Access          PUBLIC
Parameter       id
Method          PUT
*/

bookmac.put("/publication/update/:id", async (req, res) => {
    const updatePublicationName = await PublicationModel.findOneAndUpdate({
        id: req.params.id,
    },
    {
        name : req.body.newName,
    },
    {
        new: true,
    });
    // database.publications.forEach((pub) => {
    //     if(pub.id == req.params.id){
    //         pub.name = req.body.publicationName;
    //         return;
    //     }
    // });
    return res.json({publication: updatePublicationName, message: "publication name was updated"});
});

/* 
Route           /publication/update/book
Description     update/add new book to publication
Access          PUBLIC
Parameter       isbn
Method          PUT
*/

bookmac.put("/publication/update/book/:isbn", async (req, res) => {
    //update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
      {
         id: req.body.pubId,
      },
      {
          $push: {
            books: req.params.isbn,
          },
      },
      {
          new: true,
      }
    );

    // database.publications.forEach((publication) => {
    //     if(publication.id == req.body.pubId){
    //         return publication.books.push(req.params.isbn);
    //     }
    // });

    //update the book Database
    const updatedBookData = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publication : req.body.pubId,
        },
        {
            new: true,
        }
    )
    // database.books.forEach((book) => {
    //     if(book.ISBN == req.params.isbn){
    //         book.publication = req.body.pubId;
    //         return;
    //     }
    // });

    return res.json({books: updatedBookData, publication: updatedPublication, message: "successfully update publication"});
});

/* 
Route           /book/delete
Description     delete a book
Access          PUBLIC
Parameter       isbn
Method          DELETE
*/

bookmac.delete("/book/delete/:isbn", async (req,res) => {
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
});

/* 
Route           /book/delete/author
Description     delete a author from book
Access          PUBLIC
Parameter       isbn, authorId
Method          DELETE
*/

bookmac.delete("/book/delete/author/:isbn/:authorId", async (req,res) => {
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
});

/* 
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameter       isbn, pubId
Method          DELETE
*/

bookmac.delete("/publication/delete/book/:isbn/:pubId", async (req, res) => {
    //update the publication database
    const updatedPublicationByISBN = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.pubId,
        },
        {
            $pull : {
                books : req.params.isbn,
            }
        },
        {
            new: true,
        }
    )
    // database.publications.forEach((publication) =>{
    //     if(publication.id === parseInt(req.params.pubId)){
    //         const newBooksList = publication.books.filter(
    //             (book) => book !== req.params.isbn
    //         );
    //         publication.books = newBooksList;
    //         return; 
    //     } 
    // });

    //update the books Database
    const updatedBookData = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn,
        },
        {
            publication: 0,
        },
        {
            new: true,
        }
    )

    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         book.publication = 0; //no publication available
    //         return;
    //     }
    // });

    return res.json({books: updatedBookData, publications: updatedPublicationByISBN});
})

/* 
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameter       authorid
Method          DELETE
*/

bookmac.delete("/author/delete/:authorid", async (req, res) => {
    const deletedAuthor = await AuthorModel.findOneAndDelete({
        id: req.params.authorid,
    })
    // const updateAuthorDatabase = database.authors.filter(
    //     (author) => author.id !== parseInt(req.params.authorid)
    // );
    // database.authors = updateAuthorDatabase;

    return res.json({authors: deletedAuthor });
})

/* 
Route           /publication/delete
Description     delete an publication
Access          PUBLIC
Parameter       pubId
Method          DELETE
*/

bookmac.delete("/publication/delete/:pubId", async (req, res) => {
    const deletePuvblication = await PublicationModel.findOneAndDelete({
        id: req.params.pubId,
    })
    // const updatePublicationDatabase = database.publications.filter(
    //     (publication) => publication.id !== parseInt(req.params.pubId)
    // )
    // database.publications = updatePublicationDatabase;
    return res.json({ publications : deletePuvblication });
})

bookmac.listen(3000, () => console.log("server is running"));