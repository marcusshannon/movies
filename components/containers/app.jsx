import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import { Landing } from './Landing.jsx';
import { User } from './User.jsx';
import { Home } from './Home.jsx';
import { Nav } from './Nav.jsx';
import RecommendationsContainer from './RecommendationsContainer.jsx';
import FollowersContainer from './FollowersContainer.jsx';
import FollowingContainer from './FollowingContainer.jsx';
import MoviesContainer from './MoviesContainer.jsx';
import { root } from '../../reducers/index.js';

var initialState = {
  fetchedMovies: false,
  fetchedRecommendations: false,
  fetchedFollowers: false,
  fetchedFollowing: false,
  movies: [],
  recommendations: [],
  followers: [],
  following: []
}

const logger = createLogger();
let store = createStore(root, initialState, applyMiddleware(thunk, logger));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='/' component={Landing}/>
      <Route path='/user/:username' component={User}/>
      <Route component={Nav}>
        <Route path='/recommendations' component={RecommendationsContainer}/>
        <Route path='/followers' component={FollowersContainer}/>
        <Route path='/following' component={FollowingContainer}/>
        <Route path='/movies' component={Home}/>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
