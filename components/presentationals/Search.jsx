import React from 'react';

export const Search = (props) => {
  const renderResults = (movie, i) => {
    return (
      <div key={i} className="card">
        <div className="image">
          <img src={"https://image.tmdb.org/t/p/w300" + movie.poster_path}/>
        </div>
        <div className="content">
          {movie.title}
        </div>
        <div className="ui bottom attached button" onClick={() => props.viewMovie(movie)}>
          <i className="add icon"></i>
          Add Movie
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="ui container">
        <h1>Search</h1>
          <div className="ui fluid action input">
            <input type="text" placeholder="Search..." onChange={props.handleChange} onKeyUp={props.handleEnter}/>
            <div className="ui button" onClick={props.search}>Search</div>
          </div>
        {props.results.length > 0 && <h2>Results</h2>}
        <div className="ui six cards">
          {props.results.map(renderResults)}
        </div>
      </div>
      <div className="ui hidden divider"></div>
    </div>
  );
}
