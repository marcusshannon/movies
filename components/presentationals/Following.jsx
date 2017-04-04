import React from 'react';
import { Link } from 'react-router'

export const Following = (props) => {
  const formatFollowing = (following, i) => {
    return (
      <div key={i}>
        <img className="avatar" src={following.image}/>
        {following.name} <Link to={"/user/" + following.username}>@{following.username}</Link>
      <button onClick={() => props.unfollow(following, i)}>Unfollow</button>
      </div>
    );
  }
  return (
    <div>
      {props.following.map(formatFollowing)}
    </div>
  );
}
