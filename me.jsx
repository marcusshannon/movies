import React from 'react';
import ReactDOM from 'react-dom';
import {Search} from './search.jsx'
import { Router, Route, Link, browserHistory } from 'react-router'
import 'whatwg-fetch'

class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <a href='/logout'>Logout</a>
        <Movies/>
        <Search/>
      </div>
    );
  }
}

export class Movies extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      recommendations: []
    };
    this.formatMovies = this.formatMovies.bind(this);
    this.formatRecommendations = this.formatRecommendations.bind(this);
  }

  componentWillMount() {
    this.fetchMovies();
  }

  fetchMovies() {
    fetch('/me/movies', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      console.log(json)
      this.setState({movies: json.movies})
      this.setState({recommendations: json.recommendations})
    }.bind(this));
  }

  recommend(movie, recommend, i) {
    if (recommend === 0) {
      recommend = 1
    }
    else {
      recommend = 0;
    }
    fetch('/me/movies/recommend', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({id: movie, value: recommend})
    })
    .then(function(res) {
      if (res.status === 200) {
        var newMovies = this.state.movies
        newMovies[i].recommend = recommend
        this.setState({movies: newMovies})
      }
    }.bind(this))
  }

  formatMovies(movie, i) {
    return (
      <div key={i} className="movie" style={{float: "left"}}>
        <img src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="300" style={{borderRadius: "5px", overflow: "hidden"}}/>
        <pre>{movie.title}</pre>
        <button onClick={() => this.recommend(movie.id, movie.recommend, i)}>{movie.recommend}</button>
      </div>
    );
  }

  formatRecommendations(movie, i) {
    return (
      <div key={i} className="recommendation">
        <img src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="300" style={{borderRadius: "5px", overflow: "hidden"}}/>
        <pre>{movie.title}</pre>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Recommendations</h1>
        <div>
          {this.state.recommendations.map(this.formatRecommendations)}
        </div>
        <h1>My movies</h1>
        {this.state.movies.map(this.formatMovies)}
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
