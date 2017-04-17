import React from 'react';
import SearchContainer from '../containers/SearchContainer.jsx'

export const Movies = (props) => {
  const renderMovie = (view, i) => {
    return (
      <div key={i} className="column">
        <img className="ui rounded small image" src={"https://image.tmdb.org/t/p/w300" + view.movie.image_url}/>
        <span onClick={() => props.deleteMovie(view.movie.id)} className="fa-stack fa-lg">
          <i className="fa fa-circle fa-stack-2x" style={{color: "#FD3331"}}></i>
          <i className="fa fa-times fa-stack-1x" style ={{color: "white"}}></i>
        </span>
        <i className={view.recommend ? "thumbs up icon blue" : "thumbs up icon"} onClick={() => props.recommendMovie(view.movie.id)}></i>
      </div>
    );
  }
  return (
    <div className="ui container">
      <h1>My Movies</h1>
      <div className="seven column doubling ui grid">
        {props.views.map(renderMovie)}
      </div>
    </div>
  );
}
