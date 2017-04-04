import React from 'react';
import SearchContainer from '../containers/SearchContainer.jsx'

export const Movies = (props) => {
  const renderMovie = (movie, i) => {
    return (
      <div key={i} className="movie">
        <img className="poster" src={"https://image.tmdb.org/t/p/w300" + movie.image_url} width="150" height="225"/>
        <button type="button" className={movie.recommend ? "btn btn-primary" : "btn btn-secondary"} onClick={() => props.recommend(movie, i)}>Rec</button>
        <button type="button" className={"btn btn-secondary"} onClick={() => props.deleteMovie(movie, i)}>X</button>

      </div>
    );
  }
  return (
    <div>
      <h2>My movies</h2>
      <div className="movie-container">
        {props.movies.map(renderMovie)}
      </div>
    </div>
  );
}
