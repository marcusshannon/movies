import React from 'react';

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.search = this.search.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.format = this.format.bind(this);
  }

  search() {
    fetch('https://api.themoviedb.org/3/search/movie?api_key=0060a18df5b498aebed8aa1d2da9c9e6&query=' + this.state.search)
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      this.setState({searchResults: json.results.slice(0,3).map(this.format)})
    }.bind(this));
  }

  handleChange(event) {
    this.setState({search: event.target.value});
  }

  handleEnter(event) {
    if (event.key == 'Enter') {
      this.search()
    }
  }

  addMovie(movie) {
    console.log(movie)
  }

  format(movie, i) {
    return (
      <div key={i} className="movie">
        <img src={"https://image.tmdb.org/t/p/w300" + movie.poster_path} width="100"/>
        <pre>{movie.title}</pre>
        <input type="submit" value="Add" onClick={() => this.addMovie(movie)}/>
      </div>
    );
  }

  render() {

    return (
      <div>
        <input type="text" name="movie" onChange={this.handleChange} onKeyUp={this.handleEnter}/>
        <input type="submit" value="Search" onClick={this.search}/>
        {this.state.searchResults}
      </div>
    );
  }
}
