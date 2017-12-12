import * as React from 'react';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';

interface Props {
  airmen: AirmanModel[];
  className?: string;
}

export class Roster extends React.Component<Props> {
  renderAirmen() {
    const {airmen} = this.props;
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
  border: 1px solid ${props => props.theme.lighter};
  width: 100%; 
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
