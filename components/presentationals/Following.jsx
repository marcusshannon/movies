import React from 'react';
import { Link } from 'react-router'


export class Following extends React.Component {
  formatFollowing(following, i) {
    return (
      <div key={i}>
        <Link to={"/user/" + following.username}> {following.name} @{following.username}</Link>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.following.map(this.formatFollowing)}
      </div>
    );
  }
}
