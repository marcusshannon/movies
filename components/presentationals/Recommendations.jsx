import React from 'react';
import { Link } from 'react-router'

export class Recommendations extends React.Component {
  renderRecommendation(recommendation, i) {
    return (
      <div key={i} className="column">
        <img className="ui rounded small image" src={"https://image.tmdb.org/t/p/w300" + recommendation.movie.image_url}/>
      </div>
    );
  }

  render() {
    return (
      <div className="ui container">
        <div className="seven column doubling ui grid">
          {this.props.recommendations.map(this.renderRecommendation)}
        </div>
      </div>
    );
  }
}
