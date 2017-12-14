import * as React from 'react';
import Tracker from './tracker/Tracker';
import TopBar from './TopBar';
import ProfileRepository from './profile/repositories/ProfileRepository';
import AirmanRepository from './airman/repositories/AirmanRepository';
import UnitRepository from './unit/repositories/UnitRepository';

interface Props {
  profileRepository: ProfileRepository;
  airmanRepository: AirmanRepository;
  unitRepository: UnitRepository;
}

interface State {
  username: string;
}

export default class App extends React.Component<Props, State> {
  state = {
    username: ''
  };

  async componentDidMount() {
    const {username} = await this.props.profileRepository.findOne();
    this.setState({username});
  }

  render() {
    return (
      <div>
        <TopBar username={this.state.username}/>
        <Tracker
          airmanRepository={this.props.airmanRepository}
          unitRepository={this.props.unitRepository}
        />
      </div>
    );
  }
}
