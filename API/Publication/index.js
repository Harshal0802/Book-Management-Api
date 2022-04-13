//Initializing Express Router
const Router = require('express').Router();

//Database Establish
const PublicationModel = require("../../database/publication");

/* 
Route           /pubication
Description     to get all publications
Access          PUBLIC
Parameter       NONE
Method          GET
*/

Router.get("/", async (req, res) => {
    try {
        const getAllPublication = await PublicationModel.find();
        return res.json({publications: getAllPublication});
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /publication
Description     to get specific publications
Access          PUBLIC
Parameter       id
Method          GET
*/

Router.get("/:id", async (req, res) => {
    try {
        const getSpecificPublication = await PublicationModel.findOne({ Publication: req.params.id });
        // const getSpecificPublication = database.publications.filter(
        //     (pub) => pub.id == req.params.id
        // );
        if(!getSpecificPublication){
            return res.json({error: `No Publcation found of the pub_id ${req.params.id}`});
        }
        return res.json({publication: getSpecificPublication});
    } catch (error) {
        return res.json({error: error.message});
    }
})

/* 
Route           /publication
Description     to get list of publications based on a book
Access          PUBLIC
Parameter       isbn
Method          GET
*/

Router.get("/:isbn", async (req, res) => {
    try {
        const getPublicationList = await PublicationModel.find({ publicaton: req.params.isbn});
        // const getPublicationList = database.publications.filter(
        //     (book) => book.books.includes(req.params.isbn)
        // );
        
        if(!getPublicationList){
            return res.json({error: `No Publication found for the book's ISBN ${req.params.isbn}`});
        }
    
        return res.json({publication: getPublicationList});
    } catch (error) {
        return res.json({error: error.message});
    }
})

/* 
Route           /publication/new
Description     to add new publication
Access          PUBLIC
Parameter       NONE
Method          POST
*/

Router.post("/new", (req, res) => {
    try {
        const { newPublication } = req.body;

        PublicationModel.create(newPublication);
        // database.publications.push(newPublication);
    
        return res.json({message: "publication was added"});
    } catch (error) {
        return res.json({ error: error.message});
    }
});

/* 
Route           /publication/update/book
Description     update/add new book to publication
Access          PUBLIC
Parameter       isbn
Method          PUT
*/

Router.put("/update/book/:isbn", async (req, res) => {
    try {
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
  
      return res.json({ 
              books: updatedBookData, 
              publication: updatedPublication, 
              message: "successfully update publication"
      });
    } catch (error) {
      return res.json({error: error.message});  
    }
});

/* 
Route           /publication/update
Description     update the name of publication
Access          PUBLIC
Parameter       id
Method          PUT
*/

Router.put("/update/:id", async (req, res) => {
    try {
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
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /publication/delete/book
Description     delete a book from publication
Access          PUBLIC
Parameter       isbn, pubId
Method          DELETE
*/

Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
    try {
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
    );
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
    );

    // database.books.forEach((book) => {
    //     if(book.ISBN === req.params.isbn){
    //         book.publication = 0; //no publication available
    //         return;
    //     }
    // });

        return res.json({books: updatedBookData, publications: updatedPublicationByISBN});
    } catch (error) {
        return res.json({error: error.message});
    }
});

/* 
Route           /publication/delete
Description     delete an publication
Access          PUBLIC
Parameter       pubId
Method          DELETE
*/

Router.delete("/delete/:pubId", async (req, res) => {
    try {
        const deletePuvblication = await PublicationModel.findOneAndDelete({
            id: req.params.pubId,
        });
        // const updatePublicationDatabase = database.publications.filter(
        //     (publication) => publication.id !== parseInt(req.params.pubId)
        // )
        // database.publications = updatePublicationDatabase;
        return res.json({ publications : deletePuvblication });
    } catch (error) {
        return res.json({ error: error.message });
    }
})

module.exports = Router;