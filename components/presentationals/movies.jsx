import React from 'react';
import SearchContainer from '../containers/SearchContainer.jsx'

export const Movies = (props) => {
  const renderMovie = (view, i) => {
    return (
      <div key={i} className="card">
        <div className="image">
          <img src={"https://image.tmdb.org/t/p/w300" + view.movie.image_url}/>
        </div>
        <div className="content">
          {view.movie.title}
        </div>
        <div className="ui two bottom attached buttons">
          <div onClick={() => props.deleteMovie(view.movie.id)} className="ui red button"><i className="remove white icon"></i></div>
          <div onClick={() => props.recommendMovie(view.movie.id)} className={view.recommend ? "ui blue button" : "ui button"}><i className="star white icon"></i></div>
        </div>
      </div>
    );
  }
  return (
    <div className="ui container">
      <h1>My Movies</h1>
      <div className="ui six doubling cards">
        {props.views.map(renderMovie)}
      </div>
    </div>
  );
}
