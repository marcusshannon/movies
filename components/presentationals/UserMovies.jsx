import React from 'react';
import { Link } from 'react-router'

export const UserMovies = props => {
  const renderMovie = (view, i) => {
    var extra;
    if (view.recommend) {
      extra = (
        <div className="extra content">
          <span className="star">
            <i className="star icon"></i>
            Recommended
          </span>
        </div>
      )
    }
    return (
      <div key={i} className="card">
        <div className="image">
          <img src={"https://image.tmdb.org/t/p/w300" + view.movie.image_url}/>
        </div>
        <div className="content">
          {view.movie.title}
        </div>
        {extra}
      </div>
    );
  }

  var button = (props.user.following) ? (<button className="ui red small right floated button" onClick={() => props.unfollowUser(props.user.id)}>Unfollow</button>) : (<button className="ui primary small right floated button" onClick={() => props.followUser(props.user.id)}>Follow</button>)
  return (
    <div className="ui container">
      {button}
      <h1>{props.user.name + "'s Movies"}</h1>
      <div className="ui six doubling cards">
        {props.movies.map(renderMovie)}
      </div>
    </div>
  );
}
