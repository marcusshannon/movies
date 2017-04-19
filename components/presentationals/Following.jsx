import React from 'react';
import { Link } from 'react-router'

export const Following = (props) => {
  const formatFollowing = (user, i) => {
    return (
      <div className="item" key={i}>
        <img className="ui avatar image" src={user.image_url}/>
        <div className="content">
          <div className="header">{user.name}</div>
          <Link onClick={() => props.setUser(user.id)} className="description" to={"/user/" + user.username + "/movies"}>@{user.username}</Link>
        </div>
        <button className="ui red small right floated button" onClick={() => props.unfollowUser(user.id)}>Unfollow</button>
      </div>
    );
  }
  return (
    <div className="ui container">
      <h1>Following</h1>
      <div className="ui list">
        {props.following.map(formatFollowing)}
      </div>
  </div>
  );
}
