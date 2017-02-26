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
    this.follow = this.follow.bind(this);
    this.unfollow = this.unfollow.bind(this);
  }

  componentDidMount() {
    this.fetchMovies();
    this.fetchFollow();
  }

  fetchFollow() {
    fetch('/me/follow/' + this.props.params.username, {credentials: 'include'})
    .then(function(res) {
      return res.json()
    })
    .then(function(value) {
      this.setState({followButton: (<button onClick={value ? this.unfollow : this.follow}>{value ? 'Unfollow' : 'Follow'}</button>)})
    }.bind(this))
  }

  follow() {
    fetch('/me/follow/' + this.props.params.username, {
      method: 'POST',
      credentials: 'include'
    })
    .then(function(res) {
      if (res.status == 200) {
        this.setState({followButton: <button onClick={this.unfollow}>Unfollow</button>})
      }
    }.bind(this))
  }

  unfollow() {
    fetch('/me/follow/' + this.props.params.username, {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(function(res) {
      if (res.status == 200) {
        this.setState({followButton: <button onClick={this.follow}>Follow</button>})
      }
    }.bind(this))
  }

  fetchMovies() {
    fetch('/user/' + this.props.params.username + '/movies', {credentials: 'include'})
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
        {this.state.followButton}
        <a href='/logout'>Logout</a>
        <Movies movies={this.state.movies}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/user/:username' component={User}/>
  </Router>,
  document.getElementById('root')
);
