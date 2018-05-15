import * as React from 'react';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { Link } from 'react-router-dom';
import { FlightModel } from '../flight/model/FlightModel';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { SiteManagerActions } from './actions/SiteManagerActions';

interface FlightTableRowProps {
  airman: AirmanModel;
}

export const FlightTableRow = observer((props: FlightTableRowProps) => {
  const {airman} = props;
  return (
    <Link to={`/flights/${airman.id}`}>
      {/*<div className="flight-row">*/}
      <span className="airman-name airman-attribute">
            {`${airman.lastName}, ${airman.firstName}`}
        </span>
      <span className="airman-attribute airman-shift">
        <ShiftDisplay shift={airman.shift}/>
        <span>{airman.shift}</span>
      </span>
      <span className="airman-attribute">
        {
          airman.currentAirmanSchedule &&
          airman.currentAirmanSchedule.schedule.type
        }
      </span>
      {/*</div>*/}
    </Link>
  );
});

interface FlightTablesProps {
  flights: FlightModel[];
  siteManagerStore?: SiteManagerStore;
  siteManagerActions?: SiteManagerActions;
  className?: string;
}

@observer
export class FlightTables extends React.Component<FlightTablesProps> {
  render() {
    return (
      <React.Fragment>
        {
          this.props.flights.map(flight => {
            return (
              <div className={this.props.className} key={flight.id}>
                {this.renderHeader(flight)}
                {this.renderRows(flight.id)}
              </div>
            );
          })
        }
      </React.Fragment>
    );
  }

  private renderHeader = (flight: FlightModel) => {
    return (
      <React.Fragment>
        <div className="flight-header">
          <h3>{flight.name}</h3>
          <StyledShiftDropdown
            selectedShift={this.props.siteManagerStore!.getShiftByFlightId(flight.id)}
            setShift={(shift: ShiftType) => {
              return this.props.siteManagerActions!.setFlightShift(flight.id, shift);
            }}
            className="shift"
          />
        </div>
        <div className="flight-sub-header">
          <span>NAME</span>
          <span>SHIFT</span>
          <span>SCHEDULE</span>
        </div>
      </React.Fragment>
    );
  }

  private renderRows = (flightId: number) => {
    return this.props.siteManagerStore!.getAirmenByFlightId(flightId)
      .map((airman) => {
        return <FlightTableRow key={airman.id} airman={airman}/>;
      });
  }
}

export const StyledFlightTables = inject(
  'siteManagerStore',
  'siteManagerActions'
)(styled(FlightTables)`    
    border: 1px solid ${props => props.theme.graySteel};
    margin-bottom: 2rem;
    
    
    .flight-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: ${props => props.theme.blueSteel};
      
      h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0 5rem 0 0;
      }
      
      .shift {
        width: 5rem;
        border-bottom: 1px solid ${props => props.theme.purpleSteel};
      }
    }
        
    a {
      padding: 1rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      
      .airman-attribute {
        display: flex;
        align-items: center;
        width: 33%;
        
        > span {
          margin-left: 0.75rem;
        }
      }
      
      
      &:nth-child(odd) {
        background: ${props => props.theme.dark};
        
        &:hover {
          background: ${props => props.theme.darkest};
        }
      }

      &:nth-child(even) {
        background: ${props => props.theme.light};
        
        &:hover {
          background: ${props => props.theme.darkest};
        }
      }
   }
    
  .flight-sub-header {
    background-color: ${props => props.theme.lightest};
    padding: 1rem;
    display: flex;
    
    & > span {
      width: 33%;
      
      &:nth-child(2) {
        margin-left: 0.75rem;
      }
    }
  }
`);