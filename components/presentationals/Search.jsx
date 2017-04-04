import React from 'react';

export const Search = (props) => {
  const renderResults = (movie, i) => {
    return (
      <div key={i} className="movie">
        <img className="poster" src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}/>
        {movie.title}
        <input type="submit" value="Add" onClick={() => {props.addMovie(movie); props.clearQuery()}}/>
      </div>
    );
  }
  return (
    <div>
      <h2>Search</h2>
      <input type="text" name="movie" onChange={props.handleChange} onKeyUp={props.handleEnter}/>
      <input type="submit" value="Search" onClick={props.search}/>
      {props.results.map(renderResults)}
    </div>
  );
}
