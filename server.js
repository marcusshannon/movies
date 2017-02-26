var path = require('path');
var express = require('express');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);
var app = express();
var _ = require('lodash');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;
var bodyParser = require('body-parser')

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
  console.log(req)
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

// Routes
app.get('/user/:username', function(req, res) {
  knex.raw('SELECT 1 FROM user where username = ?', [req.params.username])
  .then(function(data) {
    if (_.isEmpty(data[0])) {
      res.send('404');
    }
    else if (!req.user) {
      res.sendFile(path.join(__dirname, 'user.html'));
    }
    else if (req.user.username === req.params.username) {
      res.sendFile(path.join(__dirname, 'me.html'))
    }
    else {
      res.sendFile(path.join(__dirname, 'userAuth.html'));
    }
  });
});

app.get('/home', function(req, res) {
  if (req.user) {
    res.sendFile(path.join(__dirname, 'home.html'));
  } else {
    res.send('Unauthorized')
  }
});

app.get('/tester', function(req, res) {
  res.sendFile(path.join(__dirname, 'home.html'));
});



app.get('/movies', function(req, res) {
  knex.raw('SELECT * FROM movie').then(function(data) {
    res.send(data[0])
  });
});


app.get('/me/movies', function(req, res) {
  if (req.user) {
    knex.raw('SELECT watched.id, watched.movie, watched.recommend, movie.title, movie.image_url FROM watched inner join movie on watched.movie = movie.id where user = ?', [req.user.id])
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

app.put('/me/movies/recommend', function(req, res) {
  if (req.user) {
    console.log(req.body.id)
    knex.raw('SELECT user FROM watched where id = ? LIMIT 1', [req.body.id])
    .then(function(data) {
      if (data[0][0].user == req.user.id) {
        knex.raw('UPDATE watched SET recommend = ? WHERE id=?', [req.body.value, req.body.id])
        .then(function() {
          res.sendStatus(200)
        })
        .catch(function() {
          res.sendStatus(403)
        })
      }
    })
    .catch(function() {
      res.sendStatus(403).end()
    })
  }
  else {
    res.sendStatus(401).end();
  }
})

app.post('/me/movies', function(req, res) {
  knex.raw('INSERT IGNORE INTO movie VALUES(?, ?, ?)', [req.body.id, req.body.title, req.body.poster_path])
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

app.get('/user/:username/movies', function(req, res) {
  knex.raw('Select * FROM Movie Where id in (SELECT movie from watched where user in (SELECT id from user where username = ?))', [req.params.username]).then(function(data) {
    res.send(data[0])
  });
});

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

app.post('/me/follow/:username', function(req, res) {
  if (req.user) {
    knex.select('id').from('user').where('username', req.params.username)
    .then(function(data) {
      if (data.length == 0) {
        return Promise.reject('invalid username')
      }
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

app.get('/', function(req, res) {
  if (req.user) {
    res.sendFile(path.join(__dirname, 'homeAuth.html'));
  }
  else {
    res.sendFile(path.join(__dirname, 'home.html'));
  }
});

app.listen(process.env.PORT || 3000);
