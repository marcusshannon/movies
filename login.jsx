import React from 'react';

export class Login extends React.Component {
  render() {
    return (
      <div>
        {this.props.user && <a href={'/user/' + this.props.user}>{this.props.user}</a>}
        {this.props.user && ' / '}
        <a href={this.props.user ? '/logout' : '/login'}>{this.props.user ? 'Logout' : 'Login with Twitter'}</a>
      </div>
    );
  }
}
