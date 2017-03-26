import React from 'react';

export class Movies extends React.Component {
  format(movie, i) {
    return (
      <div key={i} className="movie" style={{float: "left"}}>
        <img src={"https://image.tmdb.org/t/p/w300" + movie.image_url} width="140" style={{borderRadius: "8px", overflow: "hidden"}}/>
      </div>
    );
  }

  render() {
    return (
      <div style={{width: this.props.movies.length * 140, height: 220, overflowX: 'scroll', overflowY: 'hidden'}}>{this.props.movies.map(this.format)}</div>
    );
  }
}
