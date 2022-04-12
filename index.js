require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
// const database = require("./database/index");

//Models
// const BookModel = require("./database/book");
// const AuthorModel = require("./database/author");
// const PublicationModel = require("./database/publication");

//MicroServices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

//Initializing express
const bookmac = express();

//configurations
bookmac.use(express.json());

//Establish Database Connection
mongoose
    .connect(process.env.MONGO_URL,
)
.then(() => console.log("connection establish"));
 
//Initializing Microservices
bookmac.use("/book", Books);
bookmac.use("/author", Authors);
bookmac.use("/publication", Publications)

bookmac.listen(3000, () => console.log("server is running"));