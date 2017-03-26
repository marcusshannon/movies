import React from 'react';
import ReactDOM from 'react-dom';
import { Search } from './search.jsx'
import 'whatwg-fetch'

export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
        <Movies/>
      </div>
    );
  }
}

class Movies extends React.Component {

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
      <div key={i} className="movie">
        <img className='poster' src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width='150' height='225'/>
          <button type="button" className={movie.recommend == 1 ? "btn btn-primary" : "btn btn-secondary"} onClick={() => this.recommend(movie.id, movie.recommend, i)}>Rec</button>
      </div>
    );
  }

  formatRecommendations(movie, i) {
    return (
      <div key={i} className="movie">
        <img className='poster' src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="150" height='225'/>
      </div>
    );
  }

  render() {
    var div = <div className="filler"></div>;
    return (
      <div>
        <h2>Recommendations</h2>
        <div className="movie-container">
          {this.state.recommendations.map(this.formatRecommendations)}
          {div}
          {div}
          {div}
          {div}
          {div}
          {div}
        </div>
        <h2>Search</h2>
        <Search/>
        <h2>My Movies</h2>
        <div className="movie-container">
          {this.state.movies.map(this.formatMovies)}
          {div}
          {div}
          {div}
          {div}
          {div}
          {div}
        </div>
      </div>
    );
  }
}
