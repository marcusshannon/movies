export const root = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return Object.assign({}, state, {
        movies: Object.assign({}, state.movies, {
          byId: _.merge({}, state.movies.byId, action.movies.byId),
          allIds: [...action.movies.allIds, ...state.movies.allIds]
        }),
        watched: Object.assign({}, state.watched, {
          byId: _.merge({}, state.watched.byId, action.watched.byId),
          allIds: [...action.watched.allIds, ...state.watched.allIds]
        }),
      });
    case 'RECEIVE_MOVIES':
      return Object.assign({}, state, {
        movies: _.merge({}, state.movies, action.movies),
        watched: _.merge({}, state.watched, action.watched)
      });
    case 'RECEIVE_USER_MOVIES':
      return Object.assign({}, state, {
        fetchedUserMovies: true,
        userMovies: action.movies
      });
    case 'RECEIVE_RECOMMENDATIONS':
      return Object.assign({}, state, {
        recommendations: action.recommendations,
        movies: _.merge({}, state.movies, action.movies)
      });
    case 'RECEIVE_USER':
      return Object.assign({}, state, {
        currentUserFollowing: action.currentUserFollowing,
        currentUserFollowers: action.currentUserFollowers,
        currentUserWatched: action.currentUserWatched,
        movies: Object.assign({}, state.movies, {
          byId: _.merge({}, state.movies.byId, action.movies.byId),
          allIds: [...state.movies.allIds, ...action.movies.allIds]
        }),
        users: Object.assign({}, state.users, {
          byId: _.merge({}, state.users.byId, action.users.byId),
          allIds: [...state.users.allIds, ...action.users.allIds]
        }),
      });
    case 'RECEIVE_FOLLOWERS':
      return Object.assign({}, state, {
        followers: action.followers,
        fetchedFollowers: true
      });
    case 'RECEIVE_FOLLOWING':
      return Object.assign({}, state, {
        following: action.following,
        fetchedFollowing: true
      });
    case 'RECOMMEND':
      return Object.assign({}, state, {
        watched: Object.assign({}, state.watched, {
          byId: Object.assign({}, state.watched.byId, {
            [action.id]: Object.assign({}, state.watched.byId[action.id], {
              recommend: !state.watched.byId[action.id].recommend
            })
          })
        })
      })
    case 'UNFOLLOW':
      return Object.assign({}, state, {
        following: Object.assign({}, state.following, {
          byId: _.omit(state.following.byId, [action.id]),
          allIds: [
            ...state.following.allIds.slice(0, action.i),
            ...state.following.allIds.slice(action.i + 1)
          ]
        })
      });
    case 'FOLLOW':
      return Object.assign({}, state, {
        following: Object.assign({}, state.following, {
          byId: Object.assign({}, state.following.byId, {
            [action.id]: {id: action.id, user: action.user}
          }),
          allIds: [action.id, ...state.following.allIds]
        })
      });
    case 'DELETE_MOVIE':
      return Object.assign({}, state, {
        watched: Object.assign({}, state.watched, {
          byId: _.omit(state.watched.byId, [action.id]),
          allIds: [
            ...state.watched.allIds.slice(0, action.i),
            ...state.watched.allIds.slice(action.i + 1)
          ]
        })
      });
    case 'SET_USER':
      return Object.assign({}, state, {
        currentUser: action.id
      });
    default:
      return state
  }
}
