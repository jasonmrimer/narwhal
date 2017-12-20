import * as React from 'react';
import styled from 'styled-components';
import AirmanModel from '../airman/models/AirmanModel';
import { Moment } from 'moment';

interface Props {
  airmen: AirmanModel[];
  selectAirman: (airman: AirmanModel) => void;
  className?: string;
  week: Moment[];
}

const formatAttributes = (objArray: object[], key: string) => objArray.map((object: object) => object[key]).join(' / ');

export class Roster extends React.Component<Props> {
  render() {
    return (
      <table className={this.props.className}>
        <caption>Roster</caption>
        <thead>
        <tr>
          <th>NAME</th>
          <th>QUALIFICATION</th>
          <th>CERTIFICATION</th>
          <th>
            <div>{this.props.week[0].format('MMMM YYYY').toUpperCase()}</div>
            {this.renderWeek()}
          </th>
        </tr>
        </thead>
        <tbody>
        {this.renderAirmen()}
        </tbody>
      </table>
    );
  }

  private renderAirmen() {
    const {airmen} = this.props;
    return airmen.map((airman, index) => {
      return (
        <tr key={index} onClick={() => this.props.selectAirman(airman)}>
          <td>{airman.lastName}</td>
          <td>{formatAttributes(airman.qualifications, 'acronym')}</td>
          <td>{formatAttributes(airman.certifications, 'title')}</td>
          <td className="planner-row">
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
            <span><input type="checkbox"/></span>
          </td>
        </tr>
      );
    });
  }

  private renderWeek() {
    return (
      <div className="planner-header">
        {
          this.props.week.map((day, index) =>
            <span key={index}>
              <div>{day.format('DD')}</div>
              <div>{day.format('ddd').toUpperCase()}</div>
            </span>
          )
        }
      </div>
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
    vertical-align: top;
    th {
      font-size: 0.875rem;
      font-weight: 500;
      font-weight: normal;
    }
  };
   
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
  }
  
  td, th {
    padding: 0.75rem;
  }
  
  .planner-header, .planner-row {
    display: flex;
    justify-content: space-between;
  }
  
  .planner-header span {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    div:first-child{
      padding-top: 0.5rem;
      padding-bottom: 0.25rem;
    }
    
    div:last-child {
      font-size: 0.625rem;
      font-weight: 100;
    }
  }
`;
