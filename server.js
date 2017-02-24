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

app.get('/login/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' }));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/me', function(req, res) {
  if (req.user) {
    res.send(req.user);
  }
  else {
    res.send({noUser: true});
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
      res.sendFile(path.join(__dirname, 'userAuth.html'));
    }
    else {
      res.sendFile(path.join(__dirname, 'user.html'));
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
    knex.raw('Select * from movie where id in (SELECT movie from watched where user = ?)', [req.user.id])
    .then(function(data) {
      res.send(data[0]);
    })
  }
  else {
    res.send([]);
  }
})

app.post('/me/movies', function(req, res) {
  knex.raw('INSERT INTO movie VALUES(?, ?, ?)', [req.body.id, req.body.title, req.body.poster_path])
  .then(function(data) {
    knex.raw('INSERT INTO watched (user, movie) VALUES (?, ?)', [req.user.id, req.body.id])
    .then(function(data) {
      console.log("completed successfully");
    })
  })
  .catch(function(err) {
    console.log(err);
  })
  res.end();
})

app.get('/user/:username/movies', function(req, res) {
  knex.raw('Select * FROM Movie Where id in (SELECT movie from watched where user in (SELECT id from user where username = ?))', [req.params.username]).then(function(data) {
    res.send(data[0])
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.listen(process.env.PORT || 3000);
