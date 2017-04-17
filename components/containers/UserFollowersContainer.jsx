import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { unfollowUser, followUser } from '../../actions/index.js';
import { getCurrentUserFollowers, getCurrentUser } from '../../selectors/index.js'
import { connect } from 'react-redux'

class UserFollowersContainer extends React.Component {
  render() {
    var title = (<h1>{this.props.user && this.props.user.name + "'s Followers"}</h1>)
    return <Followers followers={this.props.followers} title={title} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser} me={this.props.me}/>;
  }
}

const mapStateToProps = state => {
  return {
    followers: getCurrentUserFollowers(state),
    user: getCurrentUser(state),
    me: state.get('me')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    followUser: id => dispatch(followUser(id)),
    unfollowUser: id => dispatch(unfollowUser(id)),
    setUser: id => dispatch(setUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowersContainer)
