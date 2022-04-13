//Initializing Express Router
const Router = require("express").Router();

//Datbase Establish
const AuthorModel = require("../../database/author");

/* 
Route           /author
Description     to get all authors
Access          PUBLIC
Parameter       NONE
Method          GET
*/

Router.get("/", async (req, res) => {
    try {
        const getAllAuthors = await AuthorModel.find(); //find() are using for all authors
        return res.json(getAllAuthors);
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author
Description     to get specific author
Access          PUBLIC
Parameter       id
Method          GET
*/

Router.get("/:authorid", async ( req, res ) => {
    try {
        const getSpecificAuthor = await AuthorModel.findOne({author: req.params.authorid});
        // const getSpecificAuthor = database.authors.filter(
        //     (author) => author.id === parseInt(req.params.authorid)
        // );
    
        if(!getSpecificAuthor){
            return res.json({ error: `No book found for the Author_id of ${req.params.authorid} `});
        }
        return res.json({ book: getSpecificAuthor });
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author
Description     to get list of author based on a book's ISBN
Access          PUBLIC
Parameter       isbn
Method          GET
*/

Router.get("/:isbn", async (req, res) => {
    try {
        const getSpecificAuthors = await AuthorModel.find({author: req.params.isbn});
        // const getSpecificAuthors = database.authors.filter(
        //     (author) => author.books.includes(req.params.isbn)
        // );
    
        if(!getSpecificAuthors){
            return res.json({error: `No author found for the book ${req.params.isbn}`});
        }
    
        return res.json({authors: getSpecificAuthors});
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author/new
Description     to add new author
Access          PUBLIC
Parameter       NONE
Method          POST
*/

Router.post("/new", (req,res) => {
    try {
        const { newAuthor } = req.body;
        // database.authors.push(newAuthor);
        AuthorModel.create(newAuthor);
        return res.json({message: "Author was added"});
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author/update
Description     update the name of author
Access          PUBLIC
Parameter       id
Method          PUT
*/

Router.put("/update/:id", async (req,res) => {
    try {
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
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /author/delete
Description     delete an author
Access          PUBLIC
Parameter       authorid
Method          DELETE
*/

Router.delete("/delete/:authorid", async (req, res) => {
    try {
        const deletedAuthor = await AuthorModel.findOneAndDelete({
            id: req.params.authorid,
        })
        // const updateAuthorDatabase = database.authors.filter(
        //     (author) => author.id !== parseInt(req.params.authorid)
        // );
        // database.authors = updateAuthorDatabase;
    
        return res.json({authors: deletedAuthor });
    } catch (error) {
        return res.json({error: error.message});
    }
})

module.exports = Router;