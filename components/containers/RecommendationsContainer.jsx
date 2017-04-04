import React from 'react';
import { Recommendations } from '../presentationals/Recommendations.jsx';
import { connect } from 'react-redux'
import { fetchRecommendations } from '../../actions/index.js'

class RecommendationsContainer extends React.Component {
  componentWillMount() {
    this.props.fetchRecommendations();
  }

  render() {
    return <Recommendations recommendations={this.props.recommendations}/>
  }
}

const mapStateToProps = (state) => {
  return {recommendations: state.recommendations}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchRecommendations: () => {dispatch(fetchRecommendations())},
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationsContainer)
