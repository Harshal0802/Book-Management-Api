const mongoose = require("mongoose");

//create a publication schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//create a publication schema 
const PublicationModel = mongoose.model("publications",PublicationSchema);

module.exports = PublicationModel;