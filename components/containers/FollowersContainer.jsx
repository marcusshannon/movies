import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { unfollowUser, followUser, setUser } from '../../actions/index.js'
import { connect } from 'react-redux'
import { getFollowers } from '../../selectors/index.js'

class FollowersContainer extends React.Component {
  render() {
    return <Followers followers={this.props.followers} followUser={this.props.followUser} unfollowUser={this.props.unfollowUser} setUser={this.props.setUser}/>;
  }
}

const mapStateToProps = (state) => {
  return {
    followers: getFollowers(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    unfollowUser: id => dispatch(unfollowUser(id)),
    followUser: id => dispatch(followUser(id)),
    setUser: id => dispatch(setUser(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersContainer)
