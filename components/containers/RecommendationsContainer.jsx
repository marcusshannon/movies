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
  return {
    recommendations: state.recommendations.allIds.map(id => {
      return {
        movie: state.movies.byId[state.recommendations.byId[id].movie],
        user: state.users.byId[state.recommendations.byId[id].user]
      }
    })
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchRecommendations: () => {dispatch(fetchRecommendations())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendationsContainer)
