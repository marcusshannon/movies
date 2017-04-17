import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import { Router, Route, browserHistory } from 'react-router';
import { Map, OrderedSet, OrderedMap, Iterable } from 'immutable';

import { Landing } from './Landing.jsx';
import UserMoviesContainer from './UserMoviesContainer.jsx';
import { Home } from './Home.jsx';
import NavContainer from './NavContainer.jsx';
import RecommendationsContainer from './RecommendationsContainer.jsx';
import FollowersContainer from './FollowersContainer.jsx';
import UserFollowersContainer from './UserFollowersContainer.jsx';
import FollowingContainer from './FollowingContainer.jsx';
import UserFollowingContainer from './UserFollowingContainer.jsx';
import MoviesContainer from './MoviesContainer.jsx';
import { root } from '../../reducers/index.js';

var initialState = window.__INITIAL_STATE__;
initialState = Map({
  ...initialState,
  users: Map(_.mapValues(initialState.users, user => Map(user))),
  movies: Map(_.mapValues(initialState.movies, movie => Map(movie))),
  relations: OrderedSet(initialState.relations.map(relation => Map(relation))),
  views: OrderedMap(initialState.views.map(view => [Map(view.key), Map(view.value)]))
});
delete window.__INITIAL_STATE__;

const stateTransformer = (state) => {
  if (Iterable.isIterable(state)) return state.toJS();
  else return state;
};

const logger = createLogger({stateTransformer});
const store = createStore(root, initialState, applyMiddleware(thunk, logger));

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={NavContainer}>
        <Route path='/recommendations' component={RecommendationsContainer}/>
        <Route path='/followers' component={FollowersContainer}/>
        <Route path='/following' component={FollowingContainer}/>
        <Route path='/movies' component={Home}/>
        <Route path='/user/:username/movies' component={UserMoviesContainer}/>
        <Route path='/user/:username/following' component={UserFollowingContainer}/>
        <Route path='/user/:username/followers' component={UserFollowersContainer}/>
      </Route>
      <Route path='/' component={Landing}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
