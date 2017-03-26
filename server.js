var path = require('path');
var express = require('express');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);
var app = express();
var _ = require('lodash');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');


var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'mysqlpass',
    database : 'movies'
  }
});

const store = new KnexSessionStore({
  knex: knex,
  tablename: 'sessions',
  createtable: true
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(session({secret: 'movies', cookie: {maxAge: 31536000}, resave: false, saveUninitialized: false, store: store}));
app.use(passport.initialize());
app.use(passport.session());


//Auth
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new TwitterStrategy({
  consumerKey: "LH5BoPe4Z57ehizHTTddknTiW",
  consumerSecret: "T7dvsB31yEdPyXrnPtPigUHaCFP8ORl9MbncL5mWtJczqv00Rw",
  callbackURL: "http://localhost:3000/login/callback"
},
function(token, tokenSecret, profile, done) {
  knex.raw('SELECT * FROM user WHERE id = ?', [profile.id])
  .then(function(data) {
    data = data[0]
    if (data.length == 0) {
      knex.raw('INSERT INTO user VALUES (?, ?, ?)', [profile.id, profile.username, profile.displayName])
      .then(function(data) {
        return done(null, {id: profile.id, username: profile.username});
      })
      .catch(function(err) {
        return done(err);
      });
    }
    else if (data[0].id == profile.id) {
      return done(null, {id: profile.id, username: profile.username})
    }
  })
  .catch(function(err) {
    return done(err);
  });
}
));

app.get('/login', passport.authenticate('twitter'));

app.get('/login/callback', passport.authenticate('twitter', {failureRedirect: '/' }), function(req, res) {
  res.redirect('/user/' + req.user.username);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/me', function(req, res) {
  if (req.user) {
    res.send(req.user)
  }
  else {
    res.json(null)
  }
})

// data api
app.get('/api/recent', function(req, res) {
  knex('movie').orderBy('created', 'desc').limit(16)
  .then(function(data) {
    res.send(data);
  })
  .catch(function(err) {
    res.sendStatus(500);
  });
});

// get my movies
app.get('/me/movies', function(req, res) {
  if (req.user) {
    knex.raw('SELECT watched.id, watched.movie, watched.recommend, movie.title, movie.image_url FROM watched inner join movie on watched.movie = movie.id where user = ? ORDER BY watched.created DESC', [req.user.id])
    .then(function(data) {
      return {movies: data[0]}
    })
    .then(function(movieObj) {
      knex.raw('select * from movie where id in (select movie from watched where user in (select leader from follow where follower = ?) and recommend = 1)', [req.user.id])
      .then(function(data) {
        movieObj.recommendations = data[0];
        res.send(movieObj);
      });
    });
  }
  else {
    res.sendStatus(401);
  }
})


app.get('/api/recommendations', function(req, res) {
  if (req.user) {
    knex.raw('select * from movie where id in (select movie from watched where user in (select leader from follow where follower = ?) and recommend = 1)', [req.user.id])
    .then(function(data) {
      res.send(data[0]);
    });
  }
  else {
    res.sendStatus(401);
  }
});

app.get('/api/followers', function(req, res) {
  if (req.user) {
    knex.raw('select * from user where id in (select follower from follow where leader = ?)', [req.user.id])
    .then(function(data) {
      res.send(data[0]);
    });
  }
  else {
    res.sendStatus(401);
  }
});

app.get('/api/following', function(req, res) {
  if (req.user) {
    knex.raw('select * from user where id in (select leader from follow where follower = ?)', [req.user.id])
    .then(function(data) {
      res.send(data[0]);
    });
  }
  else {
    res.sendStatus(401);
  }
});

app.get('/api/movies', function(req, res) {
  if (req.user) {
    knex.raw('SELECT watched.id, watched.movie, watched.recommend, movie.title, movie.image_url FROM watched inner join movie on watched.movie = movie.id where user = ? ORDER BY watched.created DESC', [req.user.id])
    .then(function(data) {
      res.send(data[0]);
    });
  }
  else {
    res.sendStatus(401);
  }
})



// recommend a movie
app.put('/api/recommend', function(req, res) {
  if (req.user) {
    knex.raw('SELECT user FROM watched where id = ? LIMIT 1', [req.body.id])
    .then(function(data) {
      if (data[0][0].user == req.user.id) {
        knex.raw('UPDATE watched SET recommend = ? WHERE id=?', [req.body.value, req.body.id])
        .then(function() {
          res.sendStatus(200);
        })
        .catch(function(err) {
          res.sendStatus(500);
        })
      }
      else {
        res.sendStatus(403);
      }
    })
    .catch(function(err) {
      res.sendStatus(500);
    })
  }
  else {
    res.sendStatus(401);
  }
})

// watch a movie
app.post('/me/movies', function(req, res) {
  knex.raw('INSERT IGNORE INTO movie (id, title, image_url) VALUES(?, ?, ?)', [req.body.id, req.body.title, req.body.poster_path])
  .then(function() {
    knex.raw('INSERT IGNORE INTO watched (user, movie) VALUES (?, ?)', [req.user.id, req.body.id])
    .then(function() {
      res.sendStatus(200);
    })
    .catch(function(err) {
      console.log(err);
      res.sendStatus(500);
    });
  })
  .catch(function(err) {
    console.log(err);
    res.sendStatus(500);
  });
})

// get other user's movies
app.get('/user/:username/movies', function(req, res) {
  knex.raw('Select * FROM Movie Where id in (SELECT movie from watched where user in (SELECT id from user where username = ?))', [req.params.username]).then(function(data) {
    res.send(data[0])
  });
});

// check if follow someone TODO: ADD INITIAL STATE SO THIS IS UNECESSARY
app.get('/me/follow/:username', function(req, res) {
  if (req.user) {
    knex.select('id').from('user').where('username', req.params.username)
    .then(function(data) {
      if (data.length == 0) {
        return Promise.reject('invalid username')
      }
      return data[0].id
    })
    .then(function(id) {
      knex.raw('SELECT * FROM follow where leader = ? and follower = ?', [id, req.user.id])
      .then(function(data) {
        if (data[0].length == 0) {
          res.send(false)
        }
        else {
          res.send(true)
        }
      })
      .catch(function(err) {
        console.log(err);
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  else {
    res.sendStatus(401);
  }
})

// follow other user
app.post('/me/follow/:username', function(req, res) {
  if (req.user) {
    knex.raw('SELECT id from user where username = ?', [req.params.username])
    .then(function(data) {
      console.log(data);
    })
    knex.select('*').from('user').where('username', req.params.username)
    .then(function(data) {
      if (data.length == 0) {
        return Promise.reject('invalid username')
      }
      console.log(data[0])
      return data[0].id
    })
    .then(function(id) {
      knex.raw('INSERT IGNORE INTO follow (leader, follower) VALUES (?, ?)', [id, req.user.id])
      .then(function(data) {
        console.log(data);
        res.sendStatus(200);
      })
    })
    .catch(function(err) {
      console.log(err);
    })
  }
  else {
    res.sendStatus(401);
  }
});

// unfollow someone
app.delete('/me/follow/:username', function(req, res) {
  if (req.user) {
    knex.select('id').from('user').where('username', req.params.username)
    .then(function(data) {
      if (data.length == 0) {
        return Promise.reject('invalid username')
      }
      return data[0].id
    })
    .then(function(id) {
      knex.raw('DELETE FROM follow where leader = ? and follower = ?', [id, req.user.id])
      .then(function(data) {
        console.log(data);
        res.sendStatus(200);
      })
    })
    .catch(function(err) {
      console.log(err);
      res.sendStatus(500)
    })
  }
  else {
    res.sendStatus(401);
  }
})


// ROUTES
// homepage
app.get('/recommendations', function(req, res) {
  if (req.user) {
    res.render('stateful', {initialState: JSON.stringify(req.user).replace(/</g, '\\u003c'), bundle: 'app'});
  }
  else {
    res.redirect('/');
  }
})

// go to user page
app.get('/user/:username', function(req, res) {
  if (req.user && req.user.username == req.params.username) {
    res.redirect('/recommendations');
  }
  else if (req.user) {
    res.render('stateful', {initialState: JSON.stringify(req.user).replace(/</g, '\\u003c'), bundle: 'app'});
  }
  else {
    res.render('stateful', {initialState: JSON.stringify({}).replace(/</g, '\\u003c'), bundle: 'app'});
  }
});

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/recommendations');
  }
  else {
    res.render('stateful', {initialState: JSON.stringify({}).replace(/</g, '\\u003c'), bundle: 'app'});
  }
});

app.get('*', function(req, res) {
  if (req.user) {
    res.render('stateful', {initialState: JSON.stringify(req.user).replace(/</g, '\\u003c'), bundle: 'app'});
  }
  else {
    res.redirect('/');
  }
})

app.listen(process.env.PORT || 3000);
