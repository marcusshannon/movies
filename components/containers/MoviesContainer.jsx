import React from 'react';
import { Movies } from '../presentationals/Movies.jsx';
import { connect } from 'react-redux'
import { fetchMovies, recommend, deleteMovie } from '../../actions/index.js'

class MoviesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {movies: []};
  }

  componentWillMount() {
    this.props.fetchMovies();
  }

  render() {
    return <Movies movies={this.props.movies} deleteMovie={this.props.deleteMovie} recommend={this.props.recommend}/>
  }
}

const mapStateToProps = (state) => {
  return {movies: state.movies}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMovies: () => {dispatch(fetchMovies())},
    recommend: (movie, i) => {dispatch(recommend(movie, i))},
    deleteMovie: (movie, i) => {dispatch(deleteMovie(movie, i))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesContainer)
