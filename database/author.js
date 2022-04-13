const mongoose = require("mongoose");

//create a author schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    books: [{
        type: String,
        required: true,
    }],
});

//create a author model
const AuthorModel = mongoose.model("authors",AuthorSchema);

module.exports = AuthorModel;