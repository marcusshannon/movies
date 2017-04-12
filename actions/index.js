export const receiveMovies = (movies) => {
  return {
    type: 'RECEIVE_MOVIES',
    movies
  }
}

export const receiveUserMovies = (movies) => {
  return {
    type: 'RECEIVE_USER_MOVIES',
    movies
  }
}

export const receiveRecommendations = (json) => {
  return {
    type: 'RECEIVE_RECOMMENDATIONS',
    recommendations: json.recommendations,
    movies: json.movies
  }
}

export const receiveFollowers = (followers) => {
  return {
    type: 'RECEIVE_FOLLOWERS',
    followers
  }
}

export const receiveFollowing = (following) => {
  return {
    type: 'RECEIVE_FOLLOWING',
    following
  }
}

export const fetchMovies = () => {
  return (dispatch, getState) => {
    if (!getState().fetchedMovies) {
      return fetch('/api/movies', {credentials: 'include'})
        .then(res => res.json())
        .then(json => {dispatch(receiveMovies(json))});
    }
  }
}

export const fetchUser = () => {
  return (dispatch, getState) => {
    if (!getState().fetchedUserMovies) {
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

export const fetchFollowers = () => {
  return (dispatch, getState) => {
    if (!getState().fetchedFollowers) {
      return fetch('/api/followers', {credentials: 'include'})
          .then(res => res.json())
          .then(json => {dispatch(receiveFollowers(json))});
    }
  }
}

export const fetchFollowing = () => {
  return (dispatch, getState) => {
    if (!getState().fetchedFollowing) {
      return fetch('/api/following', {credentials: 'include'})
          .then(res => res.json())
          .then(json => {dispatch(receiveFollowing(json))});
    }
  }
}

export const addMovie = (movie) => {
  return (dispatch, getState) => {
      return fetch('/api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(movie)
    })
    .then(res => res.json())
    .then(json => {
      if (!json.error) {
        dispatch({type: 'ADD_MOVIE', movies: json.movies, watched: json.watched})
      }
    })
  }
}

export const unfollow = (id, i) => {
  return dispatch => {
    return fetch('/api/unfollow/' + id, {method: 'DELETE', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'UNFOLLOW', id, i})
    });
  }
}

export const follow = (id) => {
  return dispatch => {
    return fetch('/api/follow/' + id, {method: 'POST', credentials: 'include'})
    .then(res => res.json())
    .then(json => {if (json.id) dispatch({type: 'FOLLOW', id: json.id, user: id})})
  }
}

export const recommend = (id) => {
  return dispatch => {
    return fetch('/api/recommend/' + id, {method: 'PUT', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'RECOMMEND', id})
    });
  }
}

export const deleteMovie = (id, i) => {
  return dispatch => {
    return fetch('/api/movies/' + id, {method: 'DELETE', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'DELETE_MOVIE', id, i})
    });
  }
}

export const setUser = (id) => {
  return dispatch => {
    dispatch({type: 'SET_USER', id})
    return fetch('/api/user/' + id, {credentials: 'include'})
    .then(res => res.json())
    .then(json => dispatch({
      type: 'RECEIVE_USER',
      movies: json.movies,
      users: json.users,
      currentUserFollowing: json.currentUserFollowing,
      currentUserFollowers: json.currentUserFollowers,
      currentUserWatched: json.currentUserWatched
    }));
  }
}
