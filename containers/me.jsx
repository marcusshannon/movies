import React from 'react';
import ReactDOM from 'react-dom';
import { Search } from './search.jsx'
import { Router, Route, browserHistory } from 'react-router'
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
      <div key={i} className="movie" style={{float: "left", marginRight: 5}}>
        <img src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="100" style={{borderRadius: "5px", overflow: "hidden"}}/>
          <div style={{width:100, overflow: 'hidden', whiteSpace: "no-wrap"}}>
            <button type="button" style={{width: "100%"}} className={movie.recommend == 1 ? "btn btn-primary" : "btn btn-secondary"} onClick={() => this.recommend(movie.id, movie.recommend, i)}>Rec</button>
          </div>
      </div>
    );
  }

  formatRecommendations(movie, i) {
    return (
      <div key={i} className="recommendation" style={{float: 'left', marginRight: 5}}>
        <img src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="100" style={{borderRadius: "5px", overflow: "hidden"}}/>
          <div style={{width:100}}>
            {movie.title}
          </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="container">
          <h2>Recommendations</h2>
        </div>
        <div className="container" style={{overflowX: 'scroll', overflowY: 'hidden'}}>
          <div style={{width: this.state.recommendations.length * 105}}>
            {this.state.recommendations.map(this.formatRecommendations)}
          </div>
        </div>
        <div className="container">
          <h2>My Movies</h2>
        </div>
        <div className="container" style={{overflowX: 'scroll', overflowY: 'hidden'}}>
          <div style={{width: this.state.movies.length * 105}}>
            {this.state.movies.map(this.formatMovies)}
          </div>
        </div>
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
