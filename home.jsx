import React from 'react';
import ReactDOM from 'react-dom';
import {Movies} from './movies.jsx'
import { Router, Route, Link, browserHistory } from 'react-router'
import 'whatwg-fetch'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      user: {},
      loggedIn: false
    };
  }

  componentDidMount() {
    this.fetchUser();
    this.fetchMovies();
  }

  fetchUser() {
    fetch('/me', {credentials: 'include'})
    .then(function(res) {
      return res.json()
    })
    .then(function(json) {
      if (!json.noUser) {
        this.setState({loggedIn: true});
        this.setState({user: json});
      }
    }.bind(this));
  }

  fetchMovies() {
    fetch('/movies')
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      this.setState({movies: res});
    }.bind(this));
  }

  render() {

    var loginButton = <a href="/login">Login with Twitter</a>
    var userButton = null;
    if (this.state.loggedIn) {
      userButton = <a href={"/user/"+this.state.user.username}>{this.state.user.username} / </a>
    }

    if (this.state.loggedIn) {
      loginButton = <a href="/logout">Logout</a>
    }

    return (
      <div>
        <div style={{float: "right"}}>
          {userButton}
          {loginButton}
        </div>
        <h1>Recently Added</h1>
        <Movies movies={this.state.movies}/>
      </div>
    )
  }
}

class Test extends React.Component {
  render() {
    return <h1>Hello World!</h1>
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={Home}/>
  </Router>,
  document.getElementById('root')
);
