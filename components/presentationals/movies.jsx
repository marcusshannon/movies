import React from 'react';
import SearchContainer from '../containers/SearchContainer.jsx'

export const Movies = (props) => {
  const renderMovie = (movie, i) => {
    return (
      <div key={i} className="column">
        <img className="ui rounded small image" src={"https://image.tmdb.org/t/p/w300" + movie.image_url}/>
        <span className="fa-stack fa-lg recommend" onClick={() => props.recommend(movie.id)} >
          <i className={movie.recommend ? "fa fa-circle fa-stack-2x primary" : "fa fa-circle fa-stack-2x secondary"}></i>
          <i className="fa fa-check fa-stack-1x"></i>
        </span>
        <span onClick={() => props.deleteMovie(movie.id, movie.index)} className="fa-stack fa-lg delete">
          <i className="fa fa-circle fa-stack-2x" style={{color: "#FD3331"}}></i>
          <i className="fa fa-times fa-stack-1x" style ={{color: "white"}}></i>
        </span>
      </div>
    );
  }
  return (
    <div className="ui container">
      <h1>My Movies</h1>
      <div className="seven column doubling ui grid">
        {props.movies.map(renderMovie)}
      </div>
    </div>
  );
}
