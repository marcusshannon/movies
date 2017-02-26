import React from 'react';
import ReactDOM from 'react-dom';
import {Movies} from './movies.jsx'
import {Login} from './login.jsx'
import { Router, Route, Link, browserHistory } from 'react-router'
import 'whatwg-fetch'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  componentWillMount() {
    this.fetchUser();
    this.fetchMovies();
  }

  componentDidMount() {
  }

  fetchUser() {
    fetch('/me', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      if (json) {
        this.setState({user: json})
      }
    }.bind(this))
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
    return (
      <div>
        <a href='/login'>Login with Twitter</a>
        <h1>Recently Added</h1>
        <Movies movies={this.state.movies}/>
      </div>
    )
  }
}

ReactDOM.render(
  <Home/>,
  document.getElementById('root')
);
