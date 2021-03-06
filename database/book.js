const mongoose = require("mongoose");

//creating a book schema
const BookSchema = mongoose.Schema({
        ISBN: {
           type: String,
           required: true,  
           minLength: 8,
           maxLength: 10,   
        },
        title: {
           type: String,
           required: true,       
        },
        authors: [{
                type: Number,
                required: true,
        }],
        languages: String,
        pubDate: {
                type: String,
                required: true,
        },
        numPage: {
                type: Number,
                required: true,
        },
        category: [String],
        publication: {
                type: Number,
                required: true,
        },
});

//create a book model
const BookModel = mongoose.model("books",BookSchema);

module.exports = BookModel;