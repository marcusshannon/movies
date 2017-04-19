import React from 'react';
import { Link } from 'react-router'

export class Recommendations extends React.Component {
  renderRecommendation(view, i) {
    return (
      <div key={i} className="card">
        <div className="image">
          <img src={"https://image.tmdb.org/t/p/w300" + view.movie.image_url}/>
        </div>
        <div className="content">
          {view.movie.title}
          <div className="meta">
            {view.user.name}
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="ui container">
        <h1>Recommendations</h1>
        <div className="ui six doubling cards">
          {this.props.recommendations.map(this.renderRecommendation)}
        </div>
      </div>
    );
  }
}
