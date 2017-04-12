import { createSelector } from 'reselect'

const getWatchedMovies = (state) => state.watched.allIds.map(id => state.movies.byId[state.watched.byId[id].movie])

const getFollowingByUser = (state) => state.following.allIds.map(id => state.following.byId[id])
