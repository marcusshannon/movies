import React from 'react';
import { Following } from '../presentationals/Following.jsx';

export class FollowingContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { following: [] };
  }

  componentWillMount() {
    this.fetchFollowing();
  }

  fetchFollowing() {
    fetch('/api/following', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({following: json});
    }.bind(this));
  }

  render() {
    return <Following following={this.state.following}/>;
  }
}
