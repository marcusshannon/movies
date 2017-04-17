import React from 'react';
import { Link } from 'react-router'

export class Recommendations extends React.Component {
  renderRecommendation(recommendation, i) {
    return (
      <div key={i} className="column">
        <img className="ui rounded image" src={"https://image.tmdb.org/t/p/w300" + recommendation.movie.image_url}/>
        {recommendation.user.name}
      </div>
    );
  }
  render() {
    return (
      <div className="ui container">
        <div className="ui seven column doubling grid">
          {this.props.recommendations.map(this.renderRecommendation)}
        </div>
      </div>
    );
  }
}
