let books = [
    {
        ISBN: "1234ONE",
        title: "Getting started with MERN",
        authors: [1,2],
        languages: "en",
        pubDate: "2022-07-12",
        numPage: 225,
        category: ["fiction","programming","tech","webdev"],
        publication: 1,
    },
    {
        ISBN: "1234TWO",
        title: "Getting started with Competitive Programming",
        authors: [1],
        languages: "en",
        pubDate: "2022-07-24",
        numPage: 230,
        category: ["fiction","tech","webdev"],
        publication: 2,
    },
];

let authors = [
    {
        id: 1,
        name: "harshal",
        books: ["1234ONE","1234TWO"],
    },
    {
        id: 2,
        name: "vikrant",
        books: ["1234ONE"],
    }
];

let publications = [
    {
        id: 1,
        name: "chakra",
        books: ["1234ONE"],
    },
    {
        id: 2,
        name: "tailwind CSS",
        books: [""],
    }
];

module.exports = { books, authors, publications };