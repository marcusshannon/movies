import React from 'react';
import { Link } from 'react-router'

export const User = (props) => {
  const renderMovie = (movie, i) => {
    return (
      <div key={i} className="movie">
        <img className="poster" src={"https://image.tmdb.org/t/p/w300" + movie.image_url} width="150" height="225"/>
      </div>
    );
  }
  return (
    <div>
      <h2>{props.user.name}</h2>
      <div className="movie-container">
        {props.movies.map(renderMovie)}
      </div>
    </div>
  );
}
