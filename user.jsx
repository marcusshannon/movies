import React from 'react';
import ReactDOM from 'react-dom';
import {Movies} from './movies.jsx'
import {Search} from './search.jsx'
import { Router, Route, Link, browserHistory } from 'react-router'
import 'whatwg-fetch'

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies() {
    fetch('/user/' + this.props.params.userId + '/movies')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({movies: json})
    }.bind(this));
  }


  render() {
    return (
      <div>
        <a href='/login'>Login with Twitter</a>
        <Movies movies={this.state.movies}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/user/:userId' component={User}/>
  </Router>,
  document.getElementById('root')
);
