import React from 'react';
import { Movies } from '../presentationals/Movies.jsx';

export class MoviesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: []
    };
  }

  componentWillMount() {
    this.fetchMovies();
  }

  fetchMovies() {
    fetch('/api/movies', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      console.log(json);
      this.setState({movies: json});
    }.bind(this));
  }

  recommend(movie, i) {
    fetch('/api/recommend', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({id: movie.id, value: Math.abs(movie.recommend - 1)})
    })
    .then(function(res) {
      if (res.status == 200) {
        var movies = this.state.movies;
        movies[i].recommend = Math.abs(movie.recommend - 1);
        this.setState({movies: movies});
      }
    }.bind(this));
  }

  render() {
    return <Movies movies={this.state.movies} recommend={this.recommend.bind(this)}/>
  }
}
