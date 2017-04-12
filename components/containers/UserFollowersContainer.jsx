import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { unfollow, follow } from '../../actions/index.js'
import { connect } from 'react-redux'


class UserFollowersContainer extends React.Component {
  render() {
    return <Followers followers={this.props.followers} following={this.props.following} unfollow={this.props.unfollow} follow={this.props.follow}/>;
  }
}

const mapStateToProps = (state) => {
  var following = {};
  state.currentUserFollowers.allIds.map((id, i) => {
    var follow = state.currentUserFollowers.byId[id]
    console.log(follow)
    Object.assign(following, {
      [follow.user]: {id: follow.id, user: follow.user, index: i}
    })
  })
  return {
    followers: state.currentUserFollowers.allIds.map(id => state.users.byId[state.currentUserFollowers.byId[id].user]),
    following: following
  }
}

const mapDispatchToProps = dispatch => {
  return {
    follow: (id) => {dispatch(follow(id))},
    unfollow: (id, i) => {dispatch(unfollow(id, i))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowersContainer)
