import { Map, OrderedSet, OrderedMap } from 'immutable';
import moment from 'moment';

export const root = (state = [], action) => {
  switch (action.type) {
    case 'UNFOLLOW_USER':
      return state.set('relations', state.get('relations').delete(Map({leader: action.id, follower: state.get('me')})))
    case 'FOLLOW_USER':
      return state.set('relations', state.get('relations').add(Map({leader: action.id, follower: state.get('me')})))
    case 'DELETE_MOVIE':
      return state.set('views', state.get('views').delete(Map({movie: action.id, user: state.get('me')})))
    case 'ADD_MOVIE':
      return state.set('movies', state.get('movies').set(action.movie.id.toString(), Map({
        id: action.movie.id,
        title: action.movie.title,
        image_url: action.movie.poster_path,
        created: new Date()
      })))
    case 'VIEW_MOVIE':
      return state.set('views', state.get('views').set(Map({user: state.get('me'), movie: action.id}), Map({user: state.get('me'), movie: action.id, viewed: new Date(), recommend: 0})))
    case 'RECOMMEND_MOVIE':
      var path = ['views', Map({user: state.get('me'), movie: action.id})]
      var recommend = !state.getIn([...path, 'recommend'])
      return state.setIn(path, state.getIn(path).set('recommend', recommend))
    case 'SET_CURRENT_USER':
      return state.set('currentUser', action.id)
    case 'RECEIVE_CURRENT_USER':
      var merged = state.mergeDeep(action.payload)
      return merged.set('views', merged.get('views').sort((a, b) => {
        return a.get('viewed') > b.get('viewed')
      }))
    default:
      return state
  }
}
