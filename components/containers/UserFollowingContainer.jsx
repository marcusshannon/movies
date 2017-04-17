import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { unfollowUser, followUser, setUser } from '../../actions/index.js';
import { getCurrentUserFollowing, getCurrentUser } from '../../selectors/index.js'
import { connect } from 'react-redux'

class UserFollowingContainer extends React.Component {
  render() {
    var title = (<h1>{this.props.user && this.props.user.name + " is Following"}</h1>)
    return <Followers title={title} me={this.props.me} followers={this.props.following} user={this.props.user} followUser={this.props.followUser} unfollowUser={this.props.unfollowUser} setUser={this.props.setUser}/>;
  }
}

const mapStateToProps = state => {
  return {
    following: getCurrentUserFollowing(state),
    user: getCurrentUser(state),
    me: state.get('me')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    unfollowUser: id => dispatch(unfollowUser(id)),
    followUser: id => dispatch(followUser(id)),
    setUser: id => dispatch(setUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowingContainer)
