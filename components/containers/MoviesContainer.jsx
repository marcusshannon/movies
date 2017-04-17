import React from 'react';
import { Movies } from '../presentationals/Movies.jsx';
import { connect } from 'react-redux'
import { recommendMovie, deleteMovie } from '../../actions/index.js'
import { getMovies } from '../../selectors/index.js'


class MoviesContainer extends React.Component {
  render() {
    return <Movies views={this.props.views} deleteMovie={this.props.deleteMovie} recommendMovie={this.props.recommendMovie}/>
  }
}

const mapStateToProps = (state) => {
  return {
    views: getMovies(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteMovie: id => dispatch(deleteMovie(id)),
    recommendMovie: id => dispatch(recommendMovie(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesContainer)
