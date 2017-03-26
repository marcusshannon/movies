import React from 'react';
import { Login } from '../presentationals/login.jsx'
import 'whatwg-fetch'

export class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = window.__INITIAL_STATE__;
    this.state.movies = [];
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
      this.setState({following: value});
    }.bind(this))
  }

  follow() {
    fetch('/me/follow/' + this.props.params.username, {
      method: 'POST',
      credentials: 'include'
    })
    .then(function(res) {
      if (res.status == 200) {
        this.setState({following: true})
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
        this.setState({following: false})
      }
    }.bind(this))
  }


  fetchMovies() {
    fetch('/user/' + this.props.params.username + '/movies')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({movies: json})
    }.bind(this));
  }

  fetchUser() {
    fetch('/api/user/' + this.props.params.username)
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      console.log(json);
    })
  }

  renderMovie(movie, i) {
    return (
      <div key={i} className="movie">
        <img className="poster" src={"https://image.tmdb.org/t/p/w300" + movie.image_url} width="150" height="225"/>
      </div>
    );
  }


  render() {
    return (
      <div>
        <Login user={this.state.username}/>
        {this.state.username && <button onClick={this.state.following ? this.unfollow : this.follow}>{this.state.following ? 'Unfollow' : 'Follow'}</button>}
        <div className="movie-container">
          {this.state.movies.map(this.renderMovie)}
          <div className="filler"></div>
          <div className="filler"></div>
          <div className="filler"></div>
          <div className="filler"></div>
          <div className="filler"></div>
          <div className="filler"></div>
        </div>
      </div>
    );
  }
}
