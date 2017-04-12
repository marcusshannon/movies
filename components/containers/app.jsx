import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import { Router, Route, IndexRoute, IndexRedirect, browserHistory } from 'react-router';

import { Landing } from './Landing.jsx';
import UserContainer from './UserContainer.jsx';
import { Home } from './Home.jsx';
import NavContainer from './NavContainer.jsx';
import RecommendationsContainer from './RecommendationsContainer.jsx';
import FollowersContainer from './FollowersContainer.jsx';
import UserFollowersContainer from './UserFollowersContainer.jsx';
import FollowingContainer from './FollowingContainer.jsx';
import UserFollowingContainer from './UserFollowingContainer.jsx';
import MoviesContainer from './MoviesContainer.jsx';
import { root } from '../../reducers/index.js';

const initialState = window.__INITIAL_STATE__
delete window.__INITIAL_STATE__
const logger = createLogger();
const store = createStore(root, initialState, applyMiddleware(thunk, logger));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={NavContainer}>
        <Route path='/recommendations' component={RecommendationsContainer}/>
        <Route path='/followers' component={FollowersContainer}/>
        <Route path='/following' component={FollowingContainer}/>
        <Route path='/movies' component={Home}/>
        <Route path='/user/:username/movies' component={UserContainer}/>
        <Route path='/user/:username/following' component={UserFollowingContainer}/>
        <Route path='/user/:username/followers' component={UserFollowersContainer}/>
      </Route>
      <Route path='/' component={Landing}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
