import React from 'react';
import { Followers } from '../presentationals/Followers.jsx';
import { fetchFollowers } from '../../actions/index.js'
import { connect } from 'react-redux'


class FollowersContainer extends React.Component {
  componentWillMount() {
    this.props.fetchFollowers();
  }
  render() {
    return <Followers followers={this.props.followers}/>;
  }
}

const mapStateToProps = (state) => {
  return {followers: state.followers}
}

const mapDispatchToProps = dispatch => {
  return {
    fetchFollowers: () => {dispatch(fetchFollowers())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowersContainer)
