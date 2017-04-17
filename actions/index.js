import { Map, OrderedSet, OrderedMap } from 'immutable';

export const fetchUser = username => {
  return (dispatch, getState) => {
    if (getState().fetchUser) {
      return fetch('/api/user/' + getState().currentUser, {credentials: 'include'})
        .then(res => res.json())
        .then(json => dispatch(receiveUserMovies(json)));
    }
  }
}

export const fetchRecommendations = () => {
  return (dispatch, getState) => {
    if (!getState().fetchedRecommendations) {
      return fetch('/api/recommendations', {credentials: 'include'})
        .then(res => res.json())
        .then(json => {dispatch(receiveRecommendations(json))});
    }
  }
}

export const viewMovie = movie => (dispatch, getState) => {
  if (getState().get('views').has(Map({movie: movie.id, user: getState().get('me')}))) return;
  if (!getState().get('movies').has(movie.id.toString())) dispatch({type: 'ADD_MOVIE', movie});
  dispatch({type: 'VIEW_MOVIE', id: movie.id})
  fetch('/api/movies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(movie)
  });
}

export const deleteMovie = id => dispatch => {
  dispatch({type: 'DELETE_MOVIE', id})
  fetch('/api/movies/' + id, {method: 'DELETE', credentials: 'include'})
}

export const unfollowUser = id => dispatch => {
  dispatch({type: 'UNFOLLOW_USER', id})
  fetch('/api/relations/' + id, {method: 'DELETE', credentials: 'include'})
}

export const followUser = id => dispatch => {
  dispatch({type: 'FOLLOW_USER', id})
  fetch('/api/relations/' + id, {method: 'POST', credentials: 'include'})
}

export const recommendMovie = id => dispatch => {
  dispatch({type: 'RECOMMEND_MOVIE', id})
  fetch('/api/recommend/' + id, {method: 'PUT', credentials: 'include'})
}

export const setUser = id => (dispatch, getState) => {
    if (getState().get('currentUser') == getState().getIn(['users', id, 'id'])) return;
    dispatch({type: 'SET_CURRENT_USER', id})
    fetch('/api/user/' + id, {credentials: 'include'})
    .then(res => res.json())
    .then(json => {
      var payload = Map({
        users: Map(_.mapValues(json.users, user => Map(user))),
        movies: Map(_.mapValues(json.movies, movie => Map(movie))),
        relations: OrderedSet(json.relations.map(relation => Map(relation))),
        views: OrderedMap(json.views.map(view => [Map(view.key), Map(view.value)]))
      });
      dispatch({type: 'RECEIVE_CURRENT_USER', payload})
    })
  }
