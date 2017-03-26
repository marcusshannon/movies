import React from 'react';
import { Recommendations } from '../presentationals/Recommendations.jsx';

export class RecommendationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendations: []
    };
  }

  componentWillMount() {
    this.fetchRecommendations();
  }

  fetchRecommendations() {
    fetch('/api/recommendations', {credentials: 'include'})
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({recommendations: json});
    }.bind(this));
  }

  render() {
    return <Recommendations recommendations={this.state.recommendations}/>
  }
}
