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
var constants = require('./constants.js')

// var schema = require('normalizr').schema
// // var normalize = require('normalizr').normalize
// // const user = new schema.Entity('users');
// // const user = new schema.Entity('movies');


console.log('restart')

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
      knex.raw('INSERT INTO user VALUES (?, ?, ?, ?)', [profile.id, profile.username, profile.displayName, profile.photos[0].value])
      .then(function(data) {
        return done(null, {id: profile.id, username: profile.username, name: profile.displayName, image_url: profile.photos[0].value});
      })
      .catch(function(err) {
        return done(err);
      });
    }
    else if (data[0].id == profile.id) {
      return done(null, {id: profile.id, username: profile.username, name: profile.displayName, image_url: profile.photos[0].value});
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

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/recent', (req, res) => {
  knex('movie').orderBy('created', 'DESC').limit(16)
  .then(data => res.send(data))
  .catch(err => res.sendStatus(500));
});

app.get('/api/recommendations', function(req, res) {
  if (req.user) {
    knex.raw(constants.GET_RECOMMENDATIONS, [req.user.id])
    .then(raw => {
      var response = {
        recommendations: {
          byId: {},
          allIds: []
        },
        movies: {
          byId: {},
          allIds: []
        }
      };
      var rows = raw[0];
      for (var i in rows) {
        var row = rows[i];
        response.recommendations.byId[row.recommendation_id] = {
          id: row.recommendation_id,
          user: row.user,
          movie: row.movie,
          recommend: row.recommend,
          created: row.recommendation_created
        };
        response.recommendations.allIds.push(row.recommendation_id)
        response.movies.byId[row.movie_id] = {
          id: row.movie_id,
          title: row.title,
          image_url: row.image_url,
          created: row.movie_created
        }
        response.movies.allIds.push(row.movie_id)
      }
      res.send(response);
    })
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
    .then(data => {res.send(data[0])});
  }
  else {
    res.sendStatus(401);
  }
})

app.put('/api/recommend/:id', (req, res) => {
  if (req.user) {
    knex.raw('UPDATE watched set recommend = NOT recommend where id = ? and user = ?', [req.params.id, req.user.id])
    .then(data => {res.sendStatus(200)})
    .catch(err => {res.send(500)});
  }
  else {
    res.sendStatus(401);
  }
});

var initialState = (id) => {
  var response = {
    currentUserFollowing: {
      byId: {},
      allIds: []
    },
    currentUserFollowers: {
      byId: {},
      allIds: []
    },
    currentUserWatched: {
      byId: {},
      allIds: []
    },
    following: {
      byId: {},
      allIds: []
    },
    followers: {
      byId: {},
      allIds: []
    },
    users: {
      byId: {},
      allIds: []
    },
    recommendations: {
      byId: {},
      allIds: []
    },
    movies: {
      byId: {},
      allIds: []
    },
    watched: {
      byId: {},
      allIds: []
    }
  };
  return knex.raw(constants.GET_FOLLOWING, [id])
  .then(raw => {
    var rows = raw[0];

    for (var i in rows) {
      var row = rows[i];
      response.following.byId[row.follow_id] = {
        id: row.follow_id,
        user: row.leader
      };
      response.following.allIds.push(row.follow_id)
      response.users.byId[row.user_id] = {
        id: row.user_id,
        username: row.username,
        name: row.name,
        image_url: row.image_url
      }
      response.users.allIds.push(row.user_id)
    }
    return response;
  })
  .then(response => {
    return knex.raw(constants.GET_RECOMMENDATIONS, [id])
    .then(raw => {
      var rows = raw[0];
      for (var i in rows) {
        var row = rows[i];
        response.recommendations.byId[row.recommendation_id] = {
          id: row.recommendation_id,
          user: row.user,
          movie: row.movie,
          recommend: row.recommend,
          created: row.recommendation_created
        };
        response.recommendations.allIds.push(row.recommendation_id)
        if (!(row.movie_id in response.movies.byId)) {
          response.movies.byId[row.movie_id] = {
            id: row.movie_id,
            title: row.title,
            image_url: row.image_url,
            created: row.movie_created
          }
          response.movies.allIds.push(row.movie_id)
        }
      }
      return response;
    })
  })
  .then(response => {
    return knex.raw(constants.GET_FOLLOWERS, [id])
    .then(raw => {
      var rows = raw[0];
      for (var i in rows) {
        var row = rows[i];
        response.followers.byId[row.follow_id] = {
          id: row.follow_id,
          user: row.follower,
        };
        response.followers.allIds.push(row.follow_id)
        if (!(row.user_id in response.users.byId)) {
          response.users.byId[row.user_id] = {
            id: row.user_id,
            username: row.username,
            name: row.name,
            image_url: row.image_url,
          }
          response.users.allIds.push(row.user_id)
        }
      }
      return response;
    })
  })
  .then(response => {
    return knex.raw(constants.GET_MOVIES, [id])
    .then(raw => {
      var rows = raw[0];
      for (var i in rows) {
        var row = rows[i];
        response.watched.byId[row.watched_id] = {
          id: row.watched_id,
          movie: row.movie,
          recommend: row.recommend,
          created: row.watched_created
        };
        response.watched.allIds.push(row.watched_id)
        if (!(row.movie_id in response.movies.byId)) {
          response.movies.byId[row.movie_id] = {
            id: row.movie_id,
            title: row.title,
            image_url: row.image_url,
            created: row.movie_created
          }
          response.movies.allIds.push(row.movie_id)
        }
      }
      return response;
    })
  })
}

// watch a movie
app.post('/api/movies', function(req, res) {
  if (req.user) {
    knex.raw('INSERT IGNORE INTO movie (id, title, image_url) VALUES(?, ?, ?)', [req.body.id, req.body.title, req.body.poster_path])
    .then(() => {
      knex.raw('INSERT IGNORE INTO watched (user, movie) VALUES (?, ?)', [req.user.id, req.body.id])
      .then(data => {
        if (data[0].affectedRows == 0) {
          res.send({error: "Exists"});
        }
        else {
          res.send({
            watched: {
              byId: {
                [data[0].insertId]: {
                  created: Date.now(),
                  id: data[0].insertId,
                  movie: req.body.id,
                  recommend: 0
                }
              },
              allIds: [data[0].insertId]
            },
            movies: {
              byId: {
                [req.body.id]: {
                  created: Date.now(),
                  id: req.body.id,
                  title: req.body.title,
                  image_url: req.body.poster_path
                }
              },
              allIds: [req.body.id]
            }
          })
        }
      })
    })
  }
  else {
    res.sendStatus(403);
  }
})

app.delete('/api/movies/:id', function(req, res) {
  if (req.user) {
    knex.raw('DELETE IGNORE FROM watched where id = ? and user = ?', [req.params.id, req.user.id])
    .then(() => {res.sendStatus(200)})
    .catch(err => {res.sendStatus(500)});
  }
  else {
    res.sendStatus(403);
  }
})

app.get('/api/user/:id/movies', function(req, res) {
  console.log('hit')
  knex.raw('select movie.* from watched join movie on movie = movie.id where user = ? order by watched.created desc', [req.params.id])
  .then(data => {res.send(data[0])});
});

var getSQL = (statement, id) => {
  return knex.raw(statement, [id])
  .then(raw => raw[0]);
}


app.get('/api/user/:id', (req, res) => {
  var response = {
    currentUserFollowing: {
      byId: {},
      allIds: []
    },
    currentUserFollowers: {
      byId: {},
      allIds: []
    },
    users: {
      byId: {},
      allIds: []
    },
    movies: {
      byId: {},
      allIds: []
    },
    currentUserWatched: {
      byId: {},
      allIds: []
    }
  };
  getSQL(constants.GET_FOLLOWING, req.params.id)
  .then(rows => {
    for (var i in rows) {
      var row = rows[i];
      response.currentUserFollowing.byId[row.follow_id] = {
        id: row.follow_id,
        user: row.leader
      };
      response.currentUserFollowing.allIds.push(row.follow_id)
      if (!(row.user_id in response.users.byId)) {
        response.users.byId[row.user_id] = {
          id: row.user_id,
          username: row.username,
          name: row.name,
          image_url: row.image_url
        }
        response.users.allIds.push(row.user_id)
      }
    }
    return response;
  })
  .then(response => {
    return getSQL(constants.GET_FOLLOWERS, req.params.id)
    .then(rows => {
      for (var i in rows) {
        var row = rows[i];
        response.currentUserFollowers.byId[row.follow_id] = {
          id: row.follow_id,
          user: row.follower,
        };
        response.currentUserFollowers.allIds.push(row.follow_id)
        if (!(row.user_id in response.users.byId)) {
          response.users.byId[row.user_id] = {
            id: row.user_id,
            username: row.username,
            name: row.name,
            image_url: row.image_url,
          }
          response.users.allIds.push(row.user_id)
        }
      }
      return response;
    })
  })
  .then(response => {
    return getSQL(constants.GET_MOVIES, req.params.id)
    .then(rows => {
      for (var i in rows) {
        var row = rows[i];
        response.currentUserWatched.byId[row.watched_id] = {
          id: row.watched_id,
          movie: row.movie,
          recommend: row.recommend,
          created: row.watched_created
        };
        response.currentUserWatched.allIds.push(row.watched_id)
        if (!(row.movie_id in response.movies.byId)) {
          response.movies.byId[row.movie_id] = {
            id: row.movie_id,
            title: row.title,
            image_url: row.image_url,
            created: row.movie_created
          }
          response.movies.allIds.push(row.movie_id)
        }
      }
      res.send(response);
    })
  })
})

// watch a movie
app.post('/api/movies', function(req, res) {
  if (req.user) {
    knex.raw('INSERT IGNORE INTO movie (id, title, image_url) VALUES(?, ?, ?)', [req.body.id, req.body.title, req.body.poster_path])
    .then(() => {
      knex.raw('INSERT IGNORE INTO watched (user, movie) VALUES (?, ?)', [req.user.id, req.body.id])
      .then(data => {
        if (data[0].affectedRows == 0) {
          res.send({error: "Exists"});
        }
        else {
          res.send({
            watched: {
              byId: {
                [data[0].insertId]: {
                  created: Date.now(),
                  id: data[0].insertId,
                  movie: req.body.id,
                  recommend: 0
                }
              },
              allIds: [data[0].insertId]
            },
            movies: {
              byId: {
                [req.body.id]: {
                  created: Date.now(),
                  id: req.body.id,
                  title: req.body.title,
                  image_url: req.body.poster_path
                }
              },
              allIds: [req.body.id]
            }
          })
        }
      })
    })
  }
  else {
    res.sendStatus(403);
  }
});

app.delete('/api/unfollow/:id', function(req, res) {
  if (req.user) {
    knex.raw('DELETE FROM follow where id = ? and follower = ?', [req.params.id, req.user.id])
    .then(() => {res.sendStatus(200)})
    .catch((err) => {res.sendStatus(500)})
  }
  else {
    res.sendStatus(403);
  }
})

app.post('/api/follow/:id', (req, res) => {
  if (req.user) {
    knex.raw('INSERT IGNORE INTO follow (leader, follower) VALUES (?, ?)', [req.params.id, req.user.id])
    .then(data => {
      if (data[0].insertId) {
        res.send({id: data[0].insertId})
      }
      else {
        res.send({error: "Exists"});
      }
    })
    .catch(err => res.sendStatus(500))
  }
  else {
    res.send(403);
  }
})

// PAGES
app.get('/recommendations', function(req, res) {
  if (req.user) {
    initialState(req.user.id).then(response => {
      res.render('state', {initialState: JSON.stringify(Object.assign(response, {me: req.user})).replace(/</g, '\\u003c')});
    });
  }
  else {
    res.redirect('/');
  }
})

// app.get('/user/:username', function(req, res) {
//   if (req.user && req.user.username == req.params.username) {
//     res.redirect('/recommendations');
//   }
//   else {
//     knex('user').where('username', req.params.username)
//     .then(data => {
//       if (data.length == 0) {
//         res.redirect('/404');
//       }
//       else {
//         res.render('user', {initialState: JSON.stringify({user: data[0]}).replace(/</g, '\\u003c')});
//       }
//     })
//   }
// });

app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/recommendations');
  }
  else {
    res.sendFile(path.join(__dirname, '/dist/main.html'));
  }
});

app.get('*', function(req, res) {
  res.redirect('/')
})

app.listen(process.env.PORT || 3000);
