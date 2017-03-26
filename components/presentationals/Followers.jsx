import React from 'react';
import { Link } from 'react-router'


export class Followers extends React.Component {
  formatFollower(follower, i) {
    return (
      <div key={i}>
        <Link to={"/user/" + follower.username}> {follower.name} @{follower.username}</Link>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.followers.map(this.formatFollower)}
      </div>
    );
  }
}
