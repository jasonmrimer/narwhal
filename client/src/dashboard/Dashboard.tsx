import * as React from 'react';
import MissionRepository from '../mission/repositories/MissionRepository';
import { MissionModel } from '../mission/models/MissionModel';
import Mission from '../mission/Mission';
import styled from 'styled-components';
import TopBar from '../TopBar';

interface Props {
  missionRepository: MissionRepository;
  username: string;
  className?: string;
}

interface State {
  missions: MissionModel[];
}

export class Dashboard extends React.Component<Props, State> {
  state = {missions: []};
  async componentDidMount() {
    const missions = await this.props.missionRepository.findAll();
    this.setState({missions});
  }

  render() {
    return (
      [
        <TopBar key="0" username={this.props.username} pageTitle="MPS DASHBOARD"/>,
        (
          <div key="1" className={this.props.className}>
          {this.state.missions.map((mission: MissionModel, index) => {
            return <Mission mission={mission} key={index}/>;
          })}
        </div>)
      ]
    );
  }
}

export default styled(Dashboard)`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 2rem;
`;