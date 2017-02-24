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
      user: {}
    };
  }

  componentDidMount() {
    this.fetchMovies();
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
        <a href="/login">Login with Twitter</a>
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
    <Route path='/tester' component={Test}/>
  </Router>,
  document.getElementById('root')
);
