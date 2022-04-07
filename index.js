//Framework
const express = require("express");

//Database
const database = require("./database/index");

//Initializing express
const bookmac = express();

//configurations
bookmac.use(express.json());

/*
Route           /
Description     to get all book
Access          PUBLIC
Method          GET
*/
bookmac.get("/",(req, res) => {
    return res.json({ books: database.books });
});

/* 
Route           /
Description     to get specific book by isbn
Access          PUBLIC
Parameter       isbn
Method          GET
*/
bookmac.get("/is/:isbn", ( req, res ) => {
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );

    if(getSpecificBook.length === 0){
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

bookmac.get("/c/:category", (req, res) => {
    const getSpecificBooks = database.books.filter(
        (book) => book.category.includes(req.params.category) //includes is use because there is a array
    );

    if(getSpecificBooks.length === 0){
        return res.json({ error: `No book found for the category of ${req.params.category} `});
    }
    return res.json({ book: getSpecificBooks });
});

/* 
Route           /a
Description     to get a list of book based on author
Access          PUBLIC
Parameter       author
Method          GET
*/

bookmac.get("/a/:author", (req, res) => {
    const getSpecificBooksByAuthor = database.books.filter(
        (book) => {
            console.log("author id = ", book.authors);
            console.log("url author", req.params.author);
            return book.authors.includes(req.params.author)
        }
    );

    console.log("length", getSpecificBooksByAuthor);

    if(getSpecificBooksByAuthor.length === 0){
        return res.json({ error: `No book found for the author of ${req.params.author} `});
    }
    return res.json({ book: getSpecificBooksByAuthor });
});


/* 
Route           /author
Description     to get all authors
Access          PUBLIC
Parameter       NONE
Method          GET
*/

bookmac.get("/author", (req, res) => {
    return res.json({ authors: database.author });
});

/* 
Route           /aut
Description     to get specific author
Access          PUBLIC
Parameter       id
Method          GET
*/

bookmac.get("/aut/:authorid", ( req, res ) => {
    const getSpecificAuthor = database.authors.filter(
        (author) => author.id === parseInt(req.params.authorid)
    );

    if(getSpecificAuthor.length === 0){
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

bookmac.get("/author/:isbn", (req, res) => {
    const getSpecificAuthors = database.authors.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthors.length === 0){
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

bookmac.get("/pub", (req, res) => {
    return res.json({publications: database.publication});
});

/* 
Route           /pub
Description     to get specific publications
Access          PUBLIC
Parameter       id
Method          GET
*/

bookmac.get("/pub/:id", (req, res) => {
    const getSpecificPublication = database.publication.filter(
        (pub) => pub.id == req.params.id
    );

    if(getSpecificPublication.length === 0){
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

bookmac.get("/publication/:isbn", (req, res) => {
    const getPublicationList = database.publication.filter(
        (book) => book.books.includes(req.params.isbn)
    );
    
    if(getPublicationList.length === 0){
        return res.json({error: `No Publication found for the book's ISBN ${req.params.isbn}`});
    }

    return res.json({publication: getPublicationList});
})

/* 
Route           /book/new
Description     to post new book
Access          PUBLIC
Parameter       NONE
Method          POST
*/

bookmac.post("/book/new", (req, res) => {
    const { newBook } = req.body;

    database.books.push(newBook);

    return res.json({ books: database.books, message: "book was added"});
});

/* 
Route           /author/new
Description     to post new author
Access          PUBLIC
Parameter       NONE
Method          POST
*/

bookmac.post("/author/new", (req,res) => {
    const { newAuthor } = req.body;

    database.authors.push(newAuthor);

    return res.json({authors: database.authors, message: "Author was added"});
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

    database.publication.push(newPublication);

    return res.json({publicaton: database.publication, message: "publication was added"});
});

/* 
Route           /book/update
Description     update title of book
Access          PUBLIC
Parameter       title
Method          PUT
*/

bookmac.put("/book/update/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn){
            book.title = req.body.bookTitle;
            return;
        }
    });
    return res.json({books: database.books});
});

/* 
Route           /book/author/update
Description     update/add new author
Access          PUBLIC
Parameter       isbn
Method          PUT
*/

bookmac.put("/book/author/update/:isbn",(req,res) => {
    //update the book Database
    database.books.forEach((book) => {
        if(book.ISBN == req.params.isbn){
            return book.authors.push(req.body.newAuthor);
        }
    });

    //update the author database
    database.authors.forEach((author)=>{
        if(author.id == req.body.newAuthor){
            return author.books.push(req.params.isbn);
        }
    });

    return res.json({books: database.books, author: database.authors, message: "new author was added"});
});

/* 
Route           /author/update
Description     update the name of author
Access          PUBLIC
Parameter       id
Method          PUT
*/

bookmac.put("/author/update/:id",(req,res) => {
    database.authors.forEach((author) => {
        if(author.id == req.params.id){
            author.name = req.body.authorName;
            return;
        }
    });
    return res.json({author: database.authors, message: "author name is updated"});
});

/* 
Route           /publication/update
Description     update the name of publication
Access          PUBLIC
Parameter       id
Method          PUT
*/

bookmac.put("/publication/update/:id", (req, res) => {
    database.publication.forEach((pub) => {
        if(pub.id == req.params.id){
            pub.name = req.body.publicationName;
            return;
        }
    });
    return res.json({publication: database.publication, message: "publication name was updated"});
});

/* 
Route           
Description     update the name of publication
Access          PUBLIC
Parameter       id
Method          PUT
*/


bookmac.listen(3000, () => console.log("server is running"));