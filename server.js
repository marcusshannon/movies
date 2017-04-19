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
var constants = require('./constants.js');

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
app.use(session({secret: 'movies', cookie: {maxAge: 315360000}, resave: false, saveUninitialized: false, store: store}));
app.use(passport.initialize());
app.use(passport.session());

var rawSQL = (statement, params) => {
  return knex.raw(statement, params)
  .then(raw => raw[0]);
}

//Auth
const TWITTER_CONFIG = {
  consumerKey: "LH5BoPe4Z57ehizHTTddknTiW",
  consumerSecret: "T7dvsB31yEdPyXrnPtPigUHaCFP8ORl9MbncL5mWtJczqv00Rw",
  callbackURL: "http://localhost:3000/login/callback"
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new TwitterStrategy(TWITTER_CONFIG, (token, tokenSecret, profile, done) => {
  rawSQL('SELECT * FROM user WHERE id = ?', [profile.id])
  .then(data => {
    if (data.length == 0) {
      knex.raw('INSERT INTO user VALUES (?, ?, ?, ?)', [profile.id, profile.username, profile.displayName, profile.photos[0].value])
      .then(() => done(null, {id: profile.id, username: profile.username, name: profile.displayName, image_url: profile.photos[0].value}))
      .catch(err => done(err))
    }
    else {
      done(null, {id: profile.id, username: profile.username, name: profile.displayName, image_url: profile.photos[0].value});
    }
  })
  .catch(err => done(err))
}));

app.get('/login', passport.authenticate('twitter'));

app.get('/login/callback', passport.authenticate('twitter', {failureRedirect: '/' }), (req, res) => {
  res.redirect('/recommendations');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/recent', (req, res) => {
  knex('movie').orderBy('created', 'DESC').limit(14)
  .then(data => res.send(data))
  .catch(err => res.sendStatus(500));
});

app.put('/api/recommend/:id', (req, res) => {
  if (req.user) {
    rawSQL(constants.RECOMMEND, [req.params.id, req.user.id])
    .then(data => res.sendStatus(200))
    .catch(err => res.sendStatus(500));
  }
  else {
    res.sendStatus(403);
  }
});

var getFollowing = (id, response) => {
  return rawSQL(constants.GET_FOLLOWING, [id])
  .then(rows => {
    for (var i in rows) {
      var row = rows[i];
      if (!(row.leader in response.users)) {
        response.users[row.leader] = {
          id: row.leader,
          username: row.username,
          name: row.name,
          image_url: row.image_url,
        }
      }
      response.relations.push({leader: row.leader, follower: row.follower})
    }
    return response;
  });
}

var getFollowers = (id, response) => {
  return rawSQL(constants.GET_FOLLOWERS, [id])
  .then(rows => {
    for (var i in rows) {
      var row = rows[i];
      if (!(row.follower in response.users)) {
        response.users[row.follower] = {
          id: row.follower,
          username: row.username,
          name: row.name,
          image_url: row.image_url,
        }
      }
      response.relations.push({leader: row.leader, follower: row.follower})
    }
    return response;
  });
}

var getRecommendations = (id, response) => {
  return rawSQL(constants.GET_RECOMMENDATIONS, [id])
  .then(rows => {
    for (var i in rows) {
      var row = rows[i];
      if (!(row.movie_id in response.movies)) {
        response.movies[row.movie_id] = {
          id: row.movie_id,
          title: row.title,
          image_url: row.image_url,
          created: row.movie_created
        };
      }
      response.views.push(
        {
          key: {
            user: row.user,
            movie: row.movie_id
          },
          value: {
            user: row.user,
            movie: row.movie_id,
            viewed: row.recommendation_created,
            recommend: row.recommend
          }
        }
       )
    }
    return response;
  })
}

var getMovies = (id, response) => {
  return rawSQL(constants.GET_MOVIES, [id])
  .then(rows => {
    for (var i in rows) {
      var row = rows[i]
      if (!(row.movie_id in response.movies)) {
        response.movies[row.movie_id] = {
          id: row.movie_id,
          title: row.title,
          image_url: row.image_url,
          created: row.movie_created
        };
      }
      response.views.push(
        {
          key: {
            user: row.user,
            movie: row.movie_id
          },
          value: {
            user: row.user,
            movie: row.movie_id,
            viewed: row.watched_created,
            recommend: row.recommend
          }
        }
      )
    }
    return response;
  })
}

var addMe = (user, response) => {
  response.me = user.id;
  if (!(user.id in response.users)) {
    response.users[user.id] = {
      id: user.id,
      username: user.username,
      name: user.name,
      image_url: user.image_url,
    }
  }
  return response;
}

var initialState = () => {
  return {
    users: {},
    movies: {},
    relations: [],
    views: []
  };
}

app.delete('/api/movies/:id', (req, res) => {
  if (req.user) {
    knex.raw('DELETE IGNORE FROM watched where movie = ? and user = ?', [req.params.id, req.user.id])
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(500));
  }
  else {
    res.sendStatus(403);
  }
})

app.get('/api/user/:id', (req, res) => {
  var id = req.params.id
  getMovies(id, initialState())
  .then(response => getFollowing(id, response))
  .then(response => getFollowers(id, response))
  .then(response => res.send(response));
})

app.post('/api/movies', (req, res) => {
  if (req.user) {
    rawSQL(constants.INSERT_MOVIE, [req.body.id, req.body.title, req.body.poster_path])
    .then(() => {
      knex.raw(constants.WATCH, [req.user.id, req.body.id])
      .then(() => res.sendStatus(200))
    })
  }
  else {
    res.sendStatus(403);
  }
});

app.delete('/api/relations/:id', (req, res) => {
  if (req.user) {
    knex.raw(constants.UNFOLLOW, [req.params.id, req.user.id])
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(500))
  }
  else {
    res.sendStatus(403);
  }
})

app.post('/api/relations/:id', (req, res) => {
  if (req.user) {
    rawSQL(constants.FOLLOW, [req.params.id, req.user.id])
    .then(data => res.sendStatus(200))
    .catch(err => res.sendStatus(500))
  }
  else {
    res.send(403);
  }
})

// PAGES
app.get('/recommendations', (req, res) => {
  if (req.user) {
    var id = req.user.id;
    getMovies(id, addMe(req.user, initialState()))
    .then(response => getFollowers(id, response))
    .then(response => getFollowing(id, response))
    .then(response => getRecommendations(id, response))
    .then(response => res.render('state', {initialState: JSON.stringify(response).replace(/</g, '\\u003c')}))
  }
  else {
    res.redirect('/');
  }
})

app.get('/movies', (req, res) => {
  if (req.user) {
    var id = req.user.id;
    getMovies(id, addMe(req.user, initialState()))
    .then(response => getFollowers(id, response))
    .then(response => getFollowing(id, response))
    .then(response => getRecommendations(id, response))
    .then(response => res.render('state', {initialState: JSON.stringify(response).replace(/</g, '\\u003c')}))
  }
  else {
    res.redirect('/');
  }
})

app.get('/followers', (req, res) => {
  if (req.user) {
    var id = req.user.id;
    getMovies(id, addMe(req.user, initialState()))
    .then(response => getFollowers(id, response))
    .then(response => getFollowing(id, response))
    .then(response => getRecommendations(id, response))
    .then(response => res.render('state', {initialState: JSON.stringify(response).replace(/</g, '\\u003c')}))
  }
  else {
    res.redirect('/');
  }
})

app.get('/following', (req, res) => {
  if (req.user) {
    var id = req.user.id;
    getMovies(id, addMe(req.user, initialState()))
    .then(response => getFollowers(id, response))
    .then(response => getFollowing(id, response))
    .then(response => getRecommendations(id, response))
    .then(response => res.render('state', {initialState: JSON.stringify(response).replace(/</g, '\\u003c')}))
  }
  else {
    res.redirect('/');
  }
})

app.get('/user/:username', (req, res) => {
  if (req.user) {
    res.redirect('/user/' + req.params.username + '/movies')
  }
  else {
    res.redirect('/');
  }
})

app.get('/user/:username/movies', (req, res) => {
  if (req.user) {
    var id;
    knex('user').select('id').where('username', req.params.username)
    .then(data => {
      if (data.length == 1) {
        id = data[0].id
      } else {
        res.redirect('/')
        Promise.reject()
      }
    })
    .then(() => getMovies(id, initialState()))
    .then(response => getFollowing(id, response))
    .then(response => getFollowers(id, response))
    .then(response => {
      response = Object.assign(response, {currentUser: id});
      id = req.user.id
      return response;
    })
    .then(response => getMovies(id, addMe(req.user, response)))
    .then(response => getFollowers(id, response))
    .then(response => getFollowing(id, response))
    .then(response => getRecommendations(id, response))
    .then(response => res.render('state', {initialState: JSON.stringify(response).replace(/</g, '\\u003c')}))
  }
  else {
    res.redirect('/')
  }
})

app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/recommendations');
  }
  else {
    res.render('state', {initialState: JSON.stringify(initialState()).replace(/</g, '\\u003c')})
  }
});

app.get('*', (req, res) => {
  res.redirect('/')
})

app.listen(process.env.PORT || 3000);
