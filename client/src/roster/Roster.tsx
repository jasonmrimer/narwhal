import * as React from 'react';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';

interface Props {
  airmen: AirmanModel[];
  selectAirman: (airman: AirmanModel) => void;
  className?: string;
}

const formatAttributes = (objArray: object[], key: string) => objArray.map((object: object) => object[key]).join(' / ');

export class Roster extends React.Component<Props> {

  renderAirmen() {
    const {airmen} = this.props;
    return airmen.map((airman, index) => {
      return (
        <tr key={index} onClick={() => this.props.selectAirman(airman)}>
          <td>{airman.lastName}</td>
          <td>{formatAttributes(airman.qualifications, 'acronym')}</td>
          <td>{formatAttributes(airman.certifications, 'title')}</td>
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
          <th>QUALIFICATION</th>
          <th>CERTIFICATION</th>
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
  margin-top: 0.5rem;
  
  caption {
    display: none;
  }
  
  thead {
    background-color: ${props => props.theme.lighter};
    text-align: left;
    
    th {
      font-size: 0.875rem;
      font-weight: 500;
    }
  };
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, th {
    padding: 0.75rem;
  }
`;
