import React from 'react';
import { Recommendations } from '../presentationals/Recommendations.jsx';
import { connect } from 'react-redux'
import { fetchRecommendations } from '../../actions/index.js'
import { getRecommendations } from '../../selectors/index.js'

class RecommendationsContainer extends React.Component {
  render() {
    return <Recommendations recommendations={this.props.recommendations}/>
  }
}

const mapStateToProps = state => {
  return {
    recommendations: getRecommendations(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchRecommendations: () => {dispatch(fetchRecommendations())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationsContainer)
