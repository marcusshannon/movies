import React from 'react';
import { Following } from '../presentationals/Following.jsx';
import { unfollow, setUser } from '../../actions/index.js'
import { connect } from 'react-redux'

export class UserFollowingContainer extends React.Component {
  render() {
    return <Following following={this.props.following} unfollow={this.props.unfollow} setUser={this.props.setUser}/>;
  }
}

const mapStateToProps = (state) => {
  return {
    following: state.currentUserFollowing.allIds.map(id => {
      return {
        user: state.users.byId[state.currentUserFollowing.byId[id].user],
        meta: state.currentUserFollowing.byId[id]
      }
    })
  }
}

const mapDispatchToProps = dispatch => {
  return {
    unfollow: (user, i) => {dispatch(unfollow(user, i))},
    setUser: (id) => {dispatch(setUser(id))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFollowingContainer)
