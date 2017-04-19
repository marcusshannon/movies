import React from 'react';
import { Search } from '../presentationals/Search.jsx';
import { viewMovie } from '../../actions/index.js';
import { connect } from 'react-redux'

class SearchContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
  }

  search = () => {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=0060a18df5b498aebed8aa1d2da9c9e6&query=' + this.state.query)
    .then(res => res.json())
    .then(json => {
      var results = json.results.slice(0,3).filter(movie => movie.poster_path != null);
      this.setState({results: results});
    });
  }

  handleChange = (event) => {
    this.setState({query: event.target.value})
    if (event.target.value == '') this.setState({results: []})
  }

  handleEnter = (event) => {
    if (event.key == 'Enter') this.search()
  }

  render() {
    return <Search viewMovie={this.props.viewMovie} clearQuery={this.clearQuery} results={this.state.results} search={this.search} handleChange={this.handleChange} handleEnter={this.handleEnter}/>;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    viewMovie: movie => dispatch(viewMovie(movie))
  }
}

export default connect(null, mapDispatchToProps)(SearchContainer)
