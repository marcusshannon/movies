import React from 'react';
import { Link } from 'react-router'

export const Followers = (props) => {
  const formatFollower = (follower, i) => {
    return (
      <div key={i}>
        <img className="avatar" src={follower.image}/>
        {follower.name} <Link to={"/user/" + follower.username}>@{follower.username}</Link>
      </div>
    );
  }
  return (
    <div>
      {props.followers.map(formatFollower)}
    </div>
  );
}
