import React from 'react';
import { Link } from 'react-router'

export const Followers = props => {
  const formatFollower = (follower, i) => {
    var button;
    if (follower.id != props.me) {
      button = (follower.following) ? (<button className="ui red small right floated button" onClick={() => props.unfollowUser(follower.id)}>Unfollow</button>) : (<button className="ui primary small right floated button" onClick={() => props.followUser(follower.id)}>Follow</button>)
    }
    return (
      <div className='item' key={i}>
        <img className="ui avatar image" src={follower.image_url}/>
        <div className="content">
          <div className="header">{follower.name}</div>
          <Link className="ui link" onClick={() => props.setUser(follower.id)} className="description" to={"/user/" + follower.username + '/movies'}>@{follower.username}</Link>
        </div>
        {button}
      </div>
    );
  }
  return (
    <div className="ui container">
      {props.title}
      <div className="ui list">
      {props.followers.map(formatFollower)}
      </div>
    </div>
  );
}
