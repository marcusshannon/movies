import React from 'react';
import ReactDOM from 'react-dom';
import {Movies} from './movies.jsx'
import {Search} from './search.jsx'
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
    fetch('/user/marcusshannon/movies')
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
        <Movies movies={this.state.movies}/>
      </div>
    );
  }
}

ReactDOM.render(
  <User/>,
  document.getElementById('root')
);
