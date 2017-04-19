import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'

class NavContainer extends React.Component {

  currentPath(link) {
    if (this.props.location.pathname == link) {
      return "item active";
    }
    return "item";
  }

  render() {
    var links = (
        <div className="ui four item menu">
            <Link className={this.currentPath('/recommendations')} to='/recommendations'>Recs</Link>
            <Link className={this.currentPath('/movies')} to='/movies'>Movies</Link>
            <Link  className={this.currentPath('/followers')} to='/followers'>Followers</Link>
            <Link className={this.currentPath('/following')} to='/following'>Following</Link>
        </div>
    );
    if (this.props.params.username) {
      var username = this.props.params.username;
      links = (
          <div className="ui four item menu">
              <Link className={this.currentPath('/recommendations')} to='/recommendations'>Home</Link>
              <Link className={this.currentPath('/user/' + username + '/movies')} to={'/user/' + username + '/movies'}>Movies</Link>
              <Link className={this.currentPath('/user/' + username + '/followers')} to={'/user/' + username + '/followers'}>Followers</Link>
              <Link className={this.currentPath('/user/' + username + '/following')} to={'/user/' + username + '/following'}>Following</Link>
          </div>
        )
    }
    return (
      <div>
        <div className="ui container" style={{marginTop: 10, marginBottom: 10}}>
          {links}
        </div>
        <div className="ui divider"></div>

        {this.props.children}
      </div>
    );
  }
}

export default NavContainer
