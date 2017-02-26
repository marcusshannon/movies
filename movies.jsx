import React from 'react';

export class Movies extends React.Component {

  format(movie, i) {
    return (
      <div key={i} className="movie" style={{float: "left"}}>
        <img src={"https://image.tmdb.org/t/p/w600" + movie.image_url} width="300" style={{borderRadius: "8px", overflow: "hidden"}}/>
        <pre>{movie.title}</pre>
      </div>
    );
  }

  render() {
    return (
      <div>{this.props.movies.map(this.format)}</div>
    );
  }
}
