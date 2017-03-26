import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router'
import { Main } from './main.jsx'
import { User } from './user.jsx'
import { Home } from './home.jsx'
import { Nav } from './nav.jsx'
import { RecommendationsContainer } from './RecommendationsContainer.jsx'
import { FollowersContainer } from './FollowersContainer.jsx'
import { FollowingContainer } from './FollowingContainer.jsx'
import { MoviesContainer } from './MoviesContainer.jsx'


ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={Main}/>
    <Route path='/user/:username' component={User}/>
    <Route component={Nav}>
      <Route path='/recommendations' component={RecommendationsContainer}/>
      <Route path='/followers' component={FollowersContainer}/>
      <Route path='/following' component={FollowingContainer}/>
      <Route path='/movies' component={MoviesContainer}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
