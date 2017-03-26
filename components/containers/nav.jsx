import React from 'react';
import { Link } from 'react-router'

export class Nav extends React.Component {
  render() {
    return (
      <div>
        <div className="nav-container">
          <Link to={"/recommendations"}>Recommendations</Link>
          <Link to={"/movies"}>Movies</Link>
          <Link to={"/followers"}>Followers</Link>
          <Link to={"/following"}>Following</Link>
          <a href='/logout'>Logout</a>
        </div>
        {this.props.children}
      </div>
    );
  }
}
