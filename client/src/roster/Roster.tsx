import * as React from 'react';
import styled from 'styled-components';
import Planner from './Planner';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { observer } from 'mobx-react';
import TrackerStore from '../tracker/stores/TrackerStore';
import NextIcon from '../icons/NextIcon';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

const formatAttributes = (objArray: object[], key: string) => objArray.map((object: object) => object[key]).join(' / ');

@observer
export class Roster extends React.Component<Props> {
  render() {
    return (
      <table className={this.props.className}>
        <caption>Roster</caption>
        <thead>
        <tr>
          <th>
            <div>NAME</div>
          </th>
          <th>
            <div>QUALIFICATION</div>
          </th>
          <th>
            <div>CERTIFICATION</div>
            {this.renderCertificationFilter()}
          </th>
          <th className="planner-header">
            <div className="month-header">{this.props.trackerStore.week[0].format('MMMM YYYY').toUpperCase()}</div>
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
    const selectedAirman = this.props.trackerStore.selectedAirman;

    return this.props.trackerStore.airmen.map((airman, index) => {
      const className = airman.id === selectedAirman.id ? 'selected' : '';
      return (
        <tr
          key={index}
          className={className}
          onClick={() => {
            this.props.trackerStore.setSelectedAirman(airman);
          }}
        >
          <td>{airman.lastName}, {airman.firstName}</td>
          <td>{formatAttributes(airman.qualifications, 'acronym')}</td>
          <td>{formatAttributes(airman.certifications, 'title')}</td>
          <Planner events={airman.events} week={this.props.trackerStore.week}/>
        </tr>
      );
    });
  }

  private renderWeek() {
    return (
      <div className="planner-day-header">
        <div/>
        {
          this.props.trackerStore.week.map((day, index) =>
            <span key={index}>
              <div>{day.format('DD')}</div>
              <div>{day.format('ddd').toUpperCase()}</div>
            </span>
          )
        }
        <span className="button-header">
          <button className="next-week" onClick={this.props.trackerStore.incrementWeekPlanner}>
            <NextIcon height={14} width={14}/>
          </button>
        </span>
      </div>
    );

  }

  private renderCertificationFilter() {
    return (
      <Select
        inputProps={{id: 'certification-filter'}}
        placeholder="Filter Certifications"
        multi={true}
        value={this.props.trackerStore.certificationIds}
        options={this.props.trackerStore.certificationOptions}
        onChange={this.props.trackerStore.setCertificationIds}
      />
    );
  }
}

export default styled(Roster)`
  border-collapse: collapse;
  background-color: ${props => props.theme.dark};
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  width: 100%;
  
   
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
   
  tbody tr:hover {
    background-color: ${props => props.theme.darker}

  }
  
  tbody tr {
    cursor: pointer;
  }
  
  tbody tr:nth-child(even) {
    background-color: ${props => props.theme.light};
    
    &:hover {
      background-color: ${props => props.theme.darker};
    }
  }
  
  td, th {
    padding: 0.75rem;
  }
  
  .planner-header {
    border-left: 1px solid ${props => props.theme.graySteel};
  }
  
  .planner-day-header, .planner-row {
    display: flex;
    justify-content: space-between;
  }
  
  .planner-row {
    border-left: 1px solid ${props => props.theme.graySteel};
  }
  
  .planner-day-header span {
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
  
  .selected {
    box-shadow: inset 0.5rem 0px 0px ${props => props.theme.yellow};
  }
  
 	.Select-control{
    border: none;
    border-bottom: 1px solid ${props => props.theme.blueSteel};
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.graySteel};    
  }
  
  .Select-menu{
    border: none;
    border-bottom: 1px solid ${props => props.theme.blueSteel};
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.graySteel};
  }
  
  .Select-option {
    border: none;
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: white;
    font-weight: 300;
    padding: 0.25rem 0.5rem;
   
    &.is-focused {
      background: ${props => props.theme.light}
    }
  }
  
  .Select.is-focused > .Select-control {
    border: none;
    border-bottom: 1px solid ${props => props.theme.blueSteel};
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.graySteel};
    box-shadow: none;
  }
  
  .Select-input {
    margin: 0;
  }
  
  .Select-input > input {
    border: none;
    border-radius: unset;
    font-size: 1rem;
    background: ${props => props.theme.lighter};
    color: ${props => props.theme.graySteel};
  }
  
  .Select-menu-outer {
    background: ${props => props.theme.lighter};
    border-radius: unset;
  }
  
  .Select-value {
    background: ${props => props.theme.lighter};
    color: white;
    border-color: white;
    margin: 0;
    margin-right: 0.25rem;
    vertical-align: middle;
    
    .Select-value-icon {
      border-right: none;
      
      &:hover {
        color: white;
      }
    }
  }
  
  .Select-placeholder {
    padding: 0;
  }
  
  .Select-clear-zone {
    color: white;
  
    &:hover {
      color: white;
    }
   }
   
   .next-week {
    background: none;
    border: none;
    padding: 0;
   }
   
  .button-header {
    display: flex;
    flex-direction: column;
    justify-content: center
  }
  
  .month-header {
  margin-left: 2.5rem;
  }
`;
