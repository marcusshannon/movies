export const root = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MOVIE':
      return Object.assign({}, state, {
        movies: [action.movie, ...state.movies]
      });
    case 'RECEIVE_MOVIES':
      return Object.assign({}, state, {
        movies: action.movies,
        fetchedMovies: true
      });
    case 'RECEIVE_RECOMMENDATIONS':
      return Object.assign({}, state, {
        recommendations: action.recommendations,
        fetchedRecommendations: true
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
        movies: state.movies.map((movie, i) => (i == action.i) ? Object.assign({}, movie, {recommend: !movie.recommend}) : movie)
      });
    case 'UNFOLLOW':
      return Object.assign({}, state, {
        following: [
          ...state.following.slice(0, action.i),
          ...state.following.slice(action.i + 1)
        ]
      });
    case 'DELETE_MOVIE':
      return Object.assign({}, state, {
        movies: [
          ...state.movies.slice(0, action.i),
          ...state.movies.slice(action.i + 1)
        ]
      });
    default:
      return state
  }
}
