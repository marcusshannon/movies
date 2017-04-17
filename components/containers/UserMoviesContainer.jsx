import React from 'react';
import { UserMovies } from '../presentationals/UserMovies.jsx'
import { fetchUser } from '../../actions/index.js'
import { connect } from 'react-redux'
import { getCurrentUser, getCurrentUserMovies } from '../../selectors/index.js'


class UserMoviesContainer extends React.Component {
  render() {
    return <UserMovies user={this.props.user} movies={this.props.movies}/>
  }
}

const mapStateToProps = state => {
  return {
    user: getCurrentUser(state),
    movies: getCurrentUserMovies(state)
  }
}

const mapDispatchToProps = state => {
  return {
  }
}

export default connect(mapStateToProps)(UserMoviesContainer)
