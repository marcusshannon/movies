import React from 'react';
import { Following } from '../presentationals/Following.jsx';
import { fetchFollowing, unfollow } from '../../actions/index.js'
import { connect } from 'react-redux'

export class FollowingContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.fetchFollowing();
  }

  unfollow = (user) => {
    fetch('/api/relationship/' + user.id, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (res.status == 200) {
        var following = new Set(this.state.following);
        following.delete(user);
        following = [...following];
        this.setState({following: following});
      }
    });
  }

  render() {
    return <Following following={this.props.following} unfollow={this.props.unfollow}/>;
  }
}

const mapStateToProps = (state) => {
  return {following: state.following}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFollowing: () => {dispatch(fetchFollowing())},
    unfollow: (user, i) => {dispatch(unfollow(user, i))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowingContainer)
