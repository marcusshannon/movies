import React from 'react';
import { Link } from 'react-router'

export const Followers = (props) => {
  const formatFollower = (follower, i) => {
    return (
      <div className='people' key={i}>
        <div>
          <img className="ui avatar image" src={follower.image_url}/>
          {follower.name} <Link to={"/user/" + follower.username}>@{follower.username}</Link>
        </div>
        {(follower.id in props.following) ? <button className="ui red mini right floated button" onClick={() => props.unfollow(props.following[follower.id].id, props.following[follower.id].index)}>Unfollow</button> : <button className="ui primary mini right floated button" onClick={() => props.follow(follower.id)}>Follow</button>}
      </div>
    );
  }
  return (
    <div className="ui container">
      {props.followers.map(formatFollower)}
    </div>
  );
}
