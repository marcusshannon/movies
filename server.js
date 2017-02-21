var path = require('path');
var express = require('express');
var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session);
var app = express();
var _ = require('lodash');
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy;

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
app.use(session({secret: 'movies', cookie: {maxAge: 3600000}, resave: false, saveUninitialized: false, store: store}));
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

// Routes
app.get('/user/:username', function(req, res) {
  console.log(req.user);
  res.sendFile(path.join(__dirname, 'user.html'));
})

app.get('/home', function(req, res) {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/movies', function(req, res) {
  knex.raw('SELECT * FROM movie').then(function(data) {
    res.send(data[0])
  });
});

app.get('/user/:username/movies', function(req, res) {
  knex.raw('Select * FROM Movie Where id in (SELECT movie from watched where user in (SELECT id from user where username = ?))', [req.params.username]).then(function(data) {
    res.send(data[0])
  });
});


app.listen(process.env.PORT || 3000);
