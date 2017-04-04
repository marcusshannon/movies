import React from 'react';
import { Link } from 'react-router'

export class Recommendations extends React.Component {
  renderRecommendation(movie, i) {
    return (
      <div key={i} className="movie">
        <img className="poster" src={"https://image.tmdb.org/t/p/w300" + movie.image_url} width="150" height="225"/>
        <Link to={"/user/" + movie.username}>@{movie.username}</Link>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2>Recommendations</h2>
        <div className="movie-container">
          {this.props.recommendations.map(this.renderRecommendation)}
        </div>
      </div>
    );
  }
}
