import React from 'react';
import ReactDOM from 'react-dom';
import {Movies} from './movies.jsx'
import 'whatwg-fetch'

class Home extends React.Component {
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
        <a href="/logout">Logout</a>
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
