//These are like stored procedures
const GET_FOLLOWING =
`SELECT
leader,
follower,
username,
name,
image_url
FROM follow
JOIN user ON leader = user.id
WHERE follower = ?`

const GET_FOLLOWERS =
`SELECT
leader,
follower,
username,
name,
image_url
FROM follow
JOIN user ON follower = user.id
WHERE leader = ?`

const GET_MOVIES =
`SELECT
  user,
  movie.id AS movie_id,
  recommend,
  watched.created AS watched_created,
  title,
  image_url,
  movie.created   AS movie_created
FROM watched
  JOIN movie ON movie = movie.id
WHERE user = ?
ORDER BY watched_created`

const GET_RECOMMENDATIONS =
`SELECT
user,
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
ORDER BY recommendation_created`

const RECOMMEND =
`UPDATE watched
SET recommend = NOT recommend
WHERE movie = ? AND user = ?`

const INSERT_MOVIE = 'INSERT IGNORE INTO movie (id, title, image_url) VALUES (?, ?, ?)'

const WATCH = 'INSERT IGNORE INTO watched (user, movie) VALUES (?, ?)'

const FOLLOW = 'INSERT IGNORE INTO follow (leader, follower) VALUES (?, ?)'

const UNFOLLOW = 'DELETE FROM follow WHERE leader = ? and follower = ?'

module.exports = {
  GET_FOLLOWING,
  GET_FOLLOWERS,
  GET_MOVIES,
  GET_RECOMMENDATIONS,
  RECOMMEND,
  INSERT_MOVIE,
  WATCH,
  FOLLOW,
  UNFOLLOW,
}
