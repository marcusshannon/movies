import React from 'react';
import ReactDOM from 'react-dom';
import { Login } from '../presentationals/Login.jsx';
import 'whatwg-fetch';

export class Landing extends React.Component {
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
    fetch('/api/recent')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({movies: json});
    }.bind(this));
  }

  render() {
    return (
      <div className="ui container">
        <Login/>
        <h1>Recently watched</h1>
        <Movies movies={this.state.movies}/>
      </div>
    );
  }
}

export class Movies extends React.Component {

  renderMovie(movie, i) {
    return (
      <div key={i} className="column">
        <a href='http://www.imdb.com' target="_blank"><img className="ui rounded small image" src={"https://image.tmdb.org/t/p/w300" + movie.image_url}/></a>
      </div>
    );
  }

  render() {
    return (
      <div className="ui seven column doubling grid">
        {this.props.movies.map(this.renderMovie)}
      </div>
    );
  }
}
