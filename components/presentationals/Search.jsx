import React from 'react';

export const Search = (props) => {
  const renderResults = (movie, i) => {
    return (
      <div key={i}>
        <img className="ui rounded small image" src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}/>
        <button className="ui button" value="Add" onClick={() => props.addMovie(movie)}>Add</button>
      </div>
    );
  }
  return (
    <div className="ui container">
      <h1>Search</h1>
      <div className="ui fluid search" style={{marginBottom: 5}}>
        <div className="ui icon fluid input">
          <input className="prompt" type="text" onChange={props.handleChange} onKeyUp={props.handleEnter}/>
          <i className="search icon"></i>
        </div>
      </div>
      <button className="ui button fluid" onClick={props.search}>Search</button>
      {props.results.map(renderResults)}
    </div>
  );
}
