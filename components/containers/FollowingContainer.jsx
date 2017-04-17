import React from 'react';
import { Following } from '../presentationals/Following.jsx';
import { followUser, unfollowUser, setUser } from '../../actions/index.js'
import { connect } from 'react-redux'
import { getFollowing } from '../../selectors/index.js'

export class FollowingContainer extends React.Component {
  render() {
    return <Following following={this.props.following} setUser={this.props.setUser} followUser={this.props.followUser} unfollowUser={this.props.unfollowUser}/>;
  }
}

const mapStateToProps = (state) => {
  return {
    following: getFollowing(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    unfollowUser: id => dispatch(unfollowUser(id)),
    followUser: id => dispatch(followUser(id)),
    setUser: id => dispatch(setUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowingContainer)
