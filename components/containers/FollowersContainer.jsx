import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';

export class FollowersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { followers: [] };
  }

  componentWillMount() {
    this.fetchFollowers();
  }

  fetchFollowers() {
    fetch('/api/followers', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({followers: json});
    }.bind(this));
  }

  render() {
    return <Followers followers={this.state.followers}/>;
  }
}
