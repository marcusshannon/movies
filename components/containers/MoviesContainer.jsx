import React from 'react';
import { Movies } from '../presentationals/Movies.jsx';
import { connect } from 'react-redux'
import { fetchMovies, recommend, deleteMovie } from '../../actions/index.js'

class MoviesContainer extends React.Component {
  render() {
    return <Movies movies={this.props.movies} deleteMovie={this.props.deleteMovie} recommend={this.props.recommend}/>
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.watched.allIds.map((id, index) => {
      return Object.assign(state.movies.byId[state.watched.byId[id].movie], {
        created: state.watched.byId[id].created,
        id: state.watched.byId[id].id,
        recommend: state.watched.byId[id].recommend,
        index: index
      })
    })
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMovies: () => {dispatch(fetchMovies())},
    recommend: (movie, i) => {dispatch(recommend(movie, i))},
    deleteMovie: (movie, i) => {dispatch(deleteMovie(movie, i))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesContainer)
