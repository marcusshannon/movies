export const receiveMovies = (movies) => {
  return {
    type: 'RECEIVE_MOVIES',
    movies
  }
}

export const receiveRecommendations = (recommendations) => {
  return {
    type: 'RECEIVE_RECOMMENDATIONS',
    recommendations
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
  return dispatch => {
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
        dispatch({type: 'ADD_MOVIE', movie: json})
      }
    })
  }
}

export const unfollow = (user, i) => {
  return dispatch => {
    return fetch('/api/following/' + user.id, {method: 'DELETE', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'UNFOLLOW', i})
    });
  }
}

export const recommend = (movie, i) => {
  return dispatch => {
    return fetch('/api/recommend/' + movie.id, {method: 'PUT', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'RECOMMEND', movie, i})
    });
  }
}

export const deleteMovie = (movie, i) => {
  return dispatch => {
    return fetch('/api/movies/' + movie.id, {method: 'DELETE', credentials: 'include'})
    .then(res => {
      if (res.status == 200) dispatch({type: 'DELETE_MOVIE', i})
    });
  }
}
