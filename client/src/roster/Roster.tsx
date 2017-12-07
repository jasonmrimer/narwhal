import * as React from 'react';

import RosterModel from './RosterModel';
import RosterRepository from './RosterRepository';
import styled from 'styled-components';

interface Props {
  rosterRepository: RosterRepository;
  className?: string;
}

interface State {
  roster: RosterModel;
}

export class Roster extends React.Component<Props, State> {
  state = {roster: new RosterModel()};

  componentDidMount() {
    this.getAirmen();
  }

  async getAirmen() {
    const roster = await this.props.rosterRepository.findOne();
    this.setState({roster});
  }

  renderAirmen() {
    const {airmen} = this.state.roster;
    return airmen.map((airman, index) => {
      return (
        <tr key={index}>
          <td>{airman.lastName}</td>
          <td>{airman.qualifications.map((qualification) => qualification.acronym).join(' / ')}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <table className={this.props.className}>
        <caption>Roster</caption>
        <thead>
        <tr>
          <th>NAME</th>
          <th>QUALIFICATIONS</th>
        </tr>
        </thead>
        <tbody>
        {this.renderAirmen()}
        </tbody>
      </table>
    );
  }
}

export default styled(Roster)`
  border-collapse: collapse;
  background-color: ${props => props.theme.dark};
  min-width: 75%;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.lighter};
  
  thead {
    background-color: ${props => props.theme.lighter};
    text-align: left;
    th {
      font-weight: 400;
    }
  };
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, th {
    padding: 0.75rem;
  }
`;
