import { createSelector } from 'reselect'
import { Map, OrderedSet, OrderedMap } from 'immutable';


export const getFollowing = state => {
  var following = [];
  state.get('relations')
  .filter(relation => relation.get('follower') == state.get('me')).map(relation => following.push(state.getIn(['users', relation.get('leader')]).toJSON()))
  return following;
}

export const getFollowers = state => {
  var followers = [];
  state.get('relations')
  .filter(relation => {
    return relation.get('leader') == state.get('me')
  })
  .map(relation => {
    followers.push(
      state.getIn(['users', relation.get('follower')])
      .set('following', state.get('relations').has(Map({leader: relation.get('follower'), follower: state.get('me')}))).toJSON()
    )
  })
  return followers;
}

export const getRecommendations = state => {
  var recommendations = []
  state.get('views')
  .filter((value, key) => {
    return state.get('relations').has(Map({leader: key.get('user'), follower: state.get('me')})) && value.get('recommend')
  })
  .map(value => {
    recommendations = [Map({
      user: state.getIn(['users', value.get('user')]),
      movie: state.getIn(['movies', value.get('movie').toString()]),
      viewed: value.get('viewed')
    }).toJSON(), ...recommendations]
  })
  return recommendations;
}

export const getMovies = state => {
  var views = [];
  state.get('views')
  .filter(value => value.get('user') == state.get('me'))
  .map(value => {
    var view = Map({
      movie: state.getIn(['movies', value.get('movie').toString()]),
      viewed: value.get('viewed'),
      recommend: value.get('recommend')
    }).toJSON()
    views = [view, ...views]
  })
  return views;
}

export const getCurrentUserMovies = state => {
  var views = [];
  state.get('views')
  .filter(value => value.get('user') == state.get('currentUser'))
  .map(value => {
    var view = Map({
      movie: state.getIn(['movies', value.get('movie').toString()]),
      viewed: value.get('viewed'),
      recommend: value.get('recommend')
    }).toJSON()
    views = [view, ...views]
  })
  return views;
}

export const getCurrentUserFollowers = state => {
  var followers = [];
  state.get('relations')
  .filter(relation => relation.get('leader') == state.get('currentUser'))
  .map(relation => {
    followers.push(
      state.getIn(['users', relation.get('follower')])
      .set('following', state.get('relations').has(Map({leader: relation.get('follower'), follower: state.get('me')}))).toJSON()
    )
  })
  return followers;
}

export const getCurrentUserFollowing = state => {
  var following = [];
  state.get('relations')
  .filter(relation => relation.get('follower') == state.get('currentUser'))
  .map(relation => {
    following.push(
      state.getIn(['users', relation.get('leader')])
      .set('following', state.get('relations').has(Map({leader: relation.get('leader'), follower: state.get('me')}))).toJSON()
    )
  })
  return following;
}


export const getCurrentUser = state => {
  var currentUser = state.get('currentUser');
  return state.getIn(['users', currentUser]).set('following', state.get('relations').has(Map({leader: currentUser, follower: state.get('me')}))).toJS()
}
