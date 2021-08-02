const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));

let users = [
    {
        id: "5",
        Name: "Jop",
        favorites: [
            //1
            {
              movie_id: "3",
              title: 'Lord of the Rings',
              actor: 'Orlando',
              genre: 'adventure',
              director: 'person'
      
          } ,
          //2
          {
              movie_id: "7",
              title: 'Harry Potter',
              actor: 'Daniel Radcliffe',
              genre: 'Fantasy',
              director: 'person',
          } ,
          //3
          {
              title: 'Imaginaerum',
              actor: 'Toumas Holopainen',
              genre: 'Fiction',
              director: 'person'
          }
      ]

    } ,
    {
        id: "6" ,
        Name: "Johannes"
    }
]

let genres = [
    {
        name: 'Fantasy',
        description: 'This is a description of this genre'
    } ,
    {
        name: 'Adventure',
        description: 'This is a description of this genre'
    } ,
    {
        name: 'Fiction',
        description: 'This is a description of this genre'
    }
]

let movies = [
    //1
    {
        title: 'Lord of the Rings',
        actor: 'Orlando',
        genre: 'Fantasy',
        director: 'person'

    } ,
    //2
    {
        title: 'Harry Potter',
        actor: 'Daniel Radcliffe',
        genre: 'Fantasy',
        director: 'person',
        movie_id: "7"
    } ,
    //3
    {
        title: 'Imaginaerum',
        actor: 'Toumas Holopainen',
        genre: 'Fiction',
        director: 'person',
        movie_id: "1"
    } ,
    //4
    {
        title: 'Cloud Atlas',
        actor: 'Person',
        genre: 'Fantasy',
        director: 'person'
    } ,
    //5
    {
        title: 'Mr. Nobody',
        actor: 'Jared Leto',
        genre: 'fiction',
        director: 'person'
    } ,
    //6
    {
        title: 'Glass',
        actor: 'Bruce Willis',
        genre: 'Adventure',
        director: 'person'
    } ,
    //7
    {
        title: 'The Prestige',
        actor: 'Christian Bale',
        genre: 'Adventure',
        director: 'person'
    } , 
    //8
    {
        title: 'The Dark Knight',
        actor: 'Christian Bale',
        genre: 'Adventure',
        director: 'person'
    } , 
    //9
    {
        title: 'Pirates of the Caribbean',
        actor: 'Orlando',
        genre: 'Adventure',
        director: 'person'
        
    } ,
    //10
    {
        title: 'Star Wars',
        actor: 'Ewan McGregor',
        genre: 'sci-fi',
        director: 'person'
    }
]

//Get Commands


app.get("/", (req, res) => {
    res.send("My Flix App");
});

/*app.get("/movies", (req, res) => {
    res.json(movies);
});
*/

app.get("/movies", (req, res) => {
    if (req.query.title) {
        res.json(movies.filter((movie) => {
            return movie.title === req.query.title
        }));
    }
    if (req.query.actor) {
        res.json(movies.filter((movie) => {
            return movie.actor === req.query.actor
        }));
    }
    if (req.query.director) {
        res.json(movies.filter((movie) => {
            return movie.director === req.query.director
        }));
    }
    if (req.query.genre) {
        res.json(movies.filter((movie) => {
            return movie.genre === req.query.genre
        }));
    }
    res.json(movies);
});



/*app.get("/movies/title/:title", (req, res) => {
    console.log("title")
    res.json(movies.find((movie) => {
        return movie.title === req.params.title
    }));
});

app.get("/movies/actor/:actor", (req, res) => {
    console.log("actor")
    res.json(movies.find(movie => {
        return movie.actor === req.params.actor
    }));
});

app.get("/movies/director/:director", (req, res) => {
    res.json(movies.find((movie) => {
        return movie.director === req.params.director
    }));
});


app.get("/movies/:genre", (req, res) => {
    res.json(movies.find((movie)=> {
        return movie.genre === req.params.genre
    }));
});
*/


app.get("/genres", (req, res) => {
    if (req.query.name) {
        res.json(genres.filter((genre) => {
            return genre.name === req.query.name
        }));
    }
    if (req.query.description) {
        res.json(genres.filter((genre) => {
            return genre.description === req.query.description
        }));
    }
    res.json(genres);
});

/*
app.get("/user", (req, res) => {
    res.json(users);
});

app.get("/user/:id", (req, res) => {
    res.json(users.filter((user) => {
        return user.id === req.params.id
    }));
});
*/

app.get("/user", (req, res) => {
    if (req.query.id) {
        res.json(users.filter((user) => {
            return user.id === req.query.id
        }));
        }
        res.json(users);
    });

//Creates New User Account

app.post("/user", (req, res) => {
    let newUser = req.body;

    if (!newUser.user_name || !newUser.password || !newUser.email || !newUser.birth_Date) {
        const message = 'Missing info in request body';
    res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        const message2 = "User " + newUser.user_name + " has been successfully created with id of " + newUser.id
        res.status(201).send(message2);
    }
});

//Update User Info

app.put("/user/:id", (req, res)=> {
    let user = users.find((user) => {
        return user.id === req.params.id
    });
    if (user) {
        req.params.user_name;
        res.status(201).send('Successfully updated username to: ' + req.params.user_name )
    } else {
        res.status(404).send('Username request failed');
    }
});

//DELETE User

app.delete('/user/:id', (req, res) => {
        let user = users.find((user) => {
             return user.id === req.params.id 
            });
      
        if (user) {
          users = users.filter((obj) => {
               return obj.id !== req.params.id 
            });
          res.status(201).send('User ' + req.params.id + ' was deleted.');
        }
      });

//Add movies to favorite list

app.post('/user/:id/favorites/:movie_id', (req, res) => {
    res.json('adds movie from favorites list');
  });

//Delete movie from favorites list
app.delete('/user/:id/favorites/:movie_id', (req, res) => {
        res.json('deletes movie from favorites list');
      });

//Error Message

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
  });
