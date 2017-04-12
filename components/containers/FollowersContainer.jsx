import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { unfollow, follow } from '../../actions/index.js'
import { connect } from 'react-redux'


class FollowersContainer extends React.Component {
  render() {
    return <Followers followers={this.props.followers} following={this.props.following} unfollow={this.props.unfollow} follow={this.props.follow}/>;
  }
}

const mapStateToProps = (state) => {
  var following = {};
  state.following.allIds.map((id, i) => {
    var follow = state.following.byId[id]
    Object.assign(following, {
      [follow.user]: {id: follow.id, user: follow.user, index: i}

    })
  })
  return {
    followers: state.followers.allIds.map(id => state.users.byId[state.followers.byId[id].user]),
    following: following
  }
}

const mapDispatchToProps = dispatch => {
  return {
    follow: (id) => {dispatch(follow(id))},
    unfollow: (id, i) => {dispatch(unfollow(id, i))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersContainer)