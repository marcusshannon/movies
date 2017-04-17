import React from 'react';
import { Link } from 'react-router'

export const UserMovies = (props) => {
  const renderMovie = (view, i) => {
    return (
      <div key={i} className="column">
        <img className="ui image rounded" src={"https://image.tmdb.org/t/p/w300" + view.movie.image_url}/>
      </div>
    );
  }
  var button = (props.user.following) ? (<button className="ui red small right floated button" onClick={() => props.unfollowUser(props.user.id)}>Unfollow</button>) : (<button className="ui primary small right floated button" onClick={() => props.followUser(props.user.id)}>Follow</button>)
  return (
    <div className="ui container">
      <h1>{props.user.name + "'s Movies"}</h1>
      {button}
      <div className="ui seven column doubling grid">
        {props.movies.map(renderMovie)}
      </div>
    </div>
  );
}
