import React from 'react';
import { User } from '../presentationals/User.jsx'
import { fetchUser } from '../../actions/index.js'
import { connect } from 'react-redux'


class UserContainer extends React.Component {
  render() {
    return <User user={this.props.user} movies={this.props.movies}/>
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.users.byId[state.currentUser],
    movies: state.currentUserWatched.allIds.map(id => state.movies.byId[state.currentUserWatched.byId[id].movie])
  }
}

export default connect(mapStateToProps)(UserContainer)
