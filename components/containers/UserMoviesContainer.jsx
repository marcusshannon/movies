import React from 'react';
import { UserMovies } from '../presentationals/UserMovies.jsx'
import { unfollowUser, followUser } from '../../actions/index.js'
import { connect } from 'react-redux'
import { getCurrentUser, getCurrentUserMovies } from '../../selectors/index.js'


class UserMoviesContainer extends React.Component {
  render() {
    return <UserMovies user={this.props.user} movies={this.props.movies} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser}/>
  }
}

const mapStateToProps = state => {
  return {
    user: getCurrentUser(state),
    movies: getCurrentUserMovies(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    unfollowUser: id => dispatch(unfollowUser(id)),
    followUser: id => dispatch(followUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMoviesContainer)
