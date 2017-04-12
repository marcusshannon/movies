import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'

class NavContainer extends React.Component {

  render() {
    var links = (
        <div className="ui four item menu">
            <Link className="item active" to='/recommendations'>Home</Link>
            <Link className="item" to='/movies'>Movies</Link>
            <Link  className="item" to='/followers'>Followers</Link>
            <Link className="item" to='/following'>Following</Link>
        </div>
    );
    if (this.props.params.username) {
      links = (
        <div>
          <Link to={'/recommendations'}>Home</Link>
          <Link to={'/user/' + this.props.params.username + '/movies'}>Movies</Link>
          <Link to={'/user/' + this.props.params.username + '/followers'}>Followers</Link>
          <Link to={'/user/' + this.props.params.username + '/following'}>Following</Link>
          <a href='/logout'>Logout</a>
        </div>
      );
    }
    return (
      <div>
        <div className="ui container" style={{marginTop: 10, marginBottom: 10}}>
          {links}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default NavContainer
