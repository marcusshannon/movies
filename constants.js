const GET_FOLLOWING =
`SELECT
follow.id AS follow_id,
leader,
follower,
user.id   AS user_id,
username,
name,
image_url
FROM follow
JOIN user ON leader = user.id
WHERE follower = ?`

const GET_FOLLOWERS =
`SELECT
follow.id AS follow_id,
leader,
follower,
user.id   AS user_id,
username,
name,
image_url
FROM follow
JOIN user ON follower = user.id
WHERE leader = ?`

const GET_MOVIES =
`SELECT
watched.id      AS watched_id,
user,
movie,
recommend,
watched.created AS watched_created,
movie.id        AS movie_id,
title,
image_url,
movie.created   AS movie_created
FROM watched
JOIN movie ON movie = movie.id
WHERE user = ?
ORDER BY watched_created DESC`

const GET_RECOMMENDATIONS =
`SELECT
watched.id      AS recommendation_id,
user,
movie,
recommend,
watched.created AS recommendation_created,
movie.id        AS movie_id,
title,
image_url,
movie.created   AS movie_created
FROM watched
JOIN movie ON movie = movie.id
WHERE user IN (SELECT leader
FROM follow
WHERE follower = ?) AND recommend = 1
ORDER BY recommendation_created DESC`

const RESPONSE = {
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

module.exports = {
  GET_FOLLOWING: GET_FOLLOWING,
  GET_FOLLOWERS: GET_FOLLOWERS,
  GET_MOVIES: GET_MOVIES,
  GET_RECOMMENDATIONS: GET_RECOMMENDATIONS
}
