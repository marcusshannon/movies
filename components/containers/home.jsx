import React from 'react';
import ReactDOM from 'react-dom';
import { Login } from '../presentationals/login.jsx'
import 'whatwg-fetch'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = __INITIAL_STATE__;
  }

  render() {
    return (
      <div>
        <Login user={this.state.username}/>
        <h1>Recently Watched</h1>
        <Movies movies={this.state.movies}/>
      </div>
    )
  }
}

class Movies extends React.Component {
  renderMovie(movie, i) {
    return (
      <div key={i}>
        <a href='http://www.imdb.com' target="_blank"><img src={"https://image.tmdb.org/t/p/w150" + movie.image_url} width="150"/></a>
        {movie.title}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.movies.map(this.renderMovie)}
      </div>
    );
  }
}

ReactDOM.render(
  <Home/>,
  document.getElementById('root')
);
