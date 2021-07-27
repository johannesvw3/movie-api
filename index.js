const express = require("express");
    morgan = require('morgan');

const app = express();

let moviesTopTen = [
    //1
    {
        title: 'Lord of the Rings'
    } ,
    //2
    {
        title: 'Harry Potter'
    } ,
    //3
    {
        title: 'Imaginaerum'
    } ,
    //4
    {
        title: 'Cloud Atlas'
    } ,
    //5
    {
        title: 'Mr. Nobody'
    } ,
    //6
    {
        title: 'Glass'
    } ,
    //7
    {
        title: 'The Prestige'
    } , 
    //8
    {
        title: 'The Dark Knight'
    } , 
    //9
    {
        title: 'Pirates of the Caribbean'
    } ,
    //10
    {
        title: 'Star Wars'
    }
]

app.use(morgan('common'));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("My Flix App");
});

app.get("/movies", (req, res) => {
    res.json(moviesTopTen);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
  });

