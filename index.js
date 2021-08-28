const express = require('express'),
bodyParser = require('body-parser'),
uuid = require('uuid'),
morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const app = express();

/*mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true }); */
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
const Actors = Models.Actor;


    //Middleware//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('common'));
app.use(express.static('public'));

      //Allowed Origins by Cors//

let allowedOrigins = ['http://localhost:8081', 'https://myflix-by-jop.herokuapp.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));


    //importing files

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport');


//Get Commands


app.get("/", (req, res) => {
    res.send("My Flix App");
});

            //GET ALL MOVIES//

        app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
          Movies.find().populate('Genre Director Actors')
          .then((movies) => {
            res.status(201).json(movies);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      });
            //GET MOVIE BY TITLE//

        app.get('/movies/title/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
            Movies.findOne({ 
                Title: req.params.title
              }).populate('Genre Director Actors')
              .then((movie) => {
                res.json(movie);
              }).catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
              });
            });

            //GET MOVIE BY GENRE//

        app.get('/movies/genre/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
            Movies.find({Genre: req.params.genre})
                .populate('Genre Director Actors')
                  .then((movie) => {
                    res.json(movie);
                  }).catch((err) => {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                  });
                });

                //GET MOVIES BY DIRECTOR//

        app.get('/movies/director/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
                Movies.find({Director: req.params.director})
                    .populate('Genre Director Actors')
                      .then((movie) => {
                        res.json(movie);
                      }).catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                      });
                    });

                //GET MOVIES BY ACTORS//

        app.get('/movies/actors/:actors', passport.authenticate('jwt', { session: false }), (req, res) => {
                Movies.find({Actors: req.params.actors})
                    .populate('Genre Director Actors')
                      .then((movie) => {
                        res.json(movie);
                      }).catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                      });
                    });

                //GET ALL GENRES//

        app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
                Genres.find().then(genres => res.json(genres));
                  });

                  //GET GENRE BY NAME//

        app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
                Genres.findOne({ 
                        Name: req.params.name}).then((genre) => {
                        res.json(genre);
                      }).catch((err) => {
                        console.error(err);
                        res.status(500).send('Error: ' + err);
                      });
                    });

        //GET ALL USERS//

        app.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
            Users.find().populate('Favorites')
            .then(users => res.json(users));
            });


        app.get('/user/id/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
            Users.findOne({ 
            _id: req.params.id}).populate('Favorites')
            .then((user) => {
            res.json(user);
          }).catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
        });
        app.get('/user/username/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
            Users.findOne({ 
                Username: req.params.username}).populate('Favorites')
                .then((user) => {
                res.json(user);
              }).catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
              });
            });

//Creates New User Account
/*[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Name', 'Name Containes invalid characters').isAlpha,
  check('Password', 'Password is required').not().isEmpty().isLength({min: 8}),
  check('Email', 'Email does not appear to be valid').isEmail()
]*/
        app.post("/user",
        [
          check('Username', 'Username is required').isLength({min: 5}),
          check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
          check('Name', 'Name contains invalid characters.'),
          check('Password', 'Password is required').not().isEmpty(),
          check('Email', 'Email does not appear to be valid').isEmail()
        ], (req, res) => {
      
        // check the validation object for errors
          let errors = validationResult(req);
      
          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
          }
      
          let hashedPassword = Users.hashPassword(req.body.Password);
          Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
              if (user) {
                //If the user is found, send a response that it already exists
                return res.status(400).send(req.body.Username + ' already exists');
              } else {
                Users
                  .create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                  })
                  .then((user) => { res.status(201).json(user) })
                  .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                  });
              }
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        });

    //Update User Info//

app.put('/user/update/:Username', passport.authenticate('jwt', { session: false }), 

[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Name', 'Name Containes invalid characters').isAlpha,
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

      //DELETE User//

    app.delete('/user/delete/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
      Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
           }
        })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

      //Add movies to favorite list//

    app.post('/user/favorites/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
      Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { Favorites: req.params.MovieID }
   },
   { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Delete movie from favorites list
    app.delete('/user/favorites/delete/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
      Users.findOneAndUpdate({ Username: req.params.Username }, {
      $pull: { Favorites: req.params.MovieID }
      },
        { new: true },
        (err, updatedUser) => {
        if (err) {
            console.error(err);
              res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
                }
            });
        });

//Error Message

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8081;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
