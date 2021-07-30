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
              Movie_ID: "3",
              title: 'Lord of the Rings',
              actor: 'Orlando',
              genre: 'adventure',
              director: 'person'
      
          } ,
          //2
          {
              Movie_ID: "7",
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
        Name: 'Fantasy'
    }
]

let movies = [
    //1
    {
        title: 'Lord of the Rings',
        actor: 'Orlando',
        genre: 'adventure',
        director: 'person'

    } ,
    //2
    {
        title: 'Harry Potter',
        actor: 'Daniel Radcliffe',
        genre: 'Fantasy',
        director: 'person',
        Movie_ID: "7"
    } ,
    //3
    {
        title: 'Imaginaerum',
        actor: 'Toumas Holopainen',
        genre: 'Fiction',
        director: 'person',
        Movie_ID: "1"
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
        genre: 'adventure',
        director: 'person'
    } ,
    //7
    {
        title: 'The Prestige',
        actor: 'Christian Bale',
        genre: 'adventure',
        director: 'person'
    } , 
    //8
    {
        title: 'The Dark Knight',
        actor: 'Christian Bale',
        genre: 'adventure',
        director: 'person'
    } , 
    //9
    {
        title: 'Pirates of the Caribbean',
        actor: 'Orlando',
        genre: 'adventure',
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

app.get("/movies", (req, res) => {
    res.json(movies);
});

/*app.get("/movies", (req, res) => {
    if (req.query.title) {
        res.json(movies.find((movie) => {
            return movie.title === req.query.title
        }));
    }
    if (req.query.actor) {
        res.json(movies.find((movie) => {
            return movie.actor === req.query.actor
        }));
    }
    if (req.query.director) {
        res.json(movies.find((movie) => {
            return movie.director === req.query.director
        }));
    }
    res.json(movies);
});
*/

app.get("/movies/title/:title", (req, res) => {
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

app.get("/genre", (req, res) => {
    res.json(genres);
});

app.get("/user", (req, res) => {
    res.json(users);
});

app.get("/user/:id", (req, res) => {
    res.json(users.find((user) => {
        return user.id === req.params.id
    }));
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

app.post("user/:id/favorites", (req, res) => {
    users.find((user) => {
        return user.filter(obj => {
            obj.favorites === req.paramss.Movie_ID
        })
    })
        res.json(favorites)
        favorites.push()
    });

//Delete movie from favorites list
app.delete('/user/:id/favorites/:Movie_ID', (req, res) => {
        let movie = favorites.find((movie) => {
             return movie.Movie_ID === req.params.Movie_ID 
            });
      
        if (movie) {
          favorites = favorites.filter((obj) => {
               return obj.Movie_ID !== req.params.Movie_ID 
            });
          res.status(201).send(favorites);
        }
      });

//Error Message

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8081, () => {
    console.log('Your app is listening on port 8081.');
  });
