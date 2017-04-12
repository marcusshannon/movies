import React from 'react';
import { Link } from 'react-router'

export const Following = (props) => {
  const formatFollowing = (following, i) => {
    return (
      <div className="people" key={i}>
        <div>
          <img className="ui avatar image" src={following.user.image_url}/>
          {following.user.name} <Link onClick={() => props.setUser(following.user.id)} to={"/user/" + following.user.username + "/movies"}>@{following.user.username}</Link>
        </div>
        <button className="ui red mini right floated button" onClick={() => props.unfollow(following.meta.id, i)}>Unfollow</button>
      </div>
    );
  }
  return (
    <div className="ui container">
      {props.following.map(formatFollowing)}
    </div>
  );
}
