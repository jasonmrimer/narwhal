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
import { StyledDropdown } from '../widgets/inputs/Dropdown';
import { StyledFlightSchedulePopup } from '../widgets/popups/FlightSchedulePopup';
import * as classNames from 'classnames';
import { ExpandIcon } from '../icons/ExpandIcon';
import { CollapseIcon } from '../icons/CollapseIcon';
import { DeleteIcon } from '../icons/DeleteIcon';
import { StyledFlightShiftPopup } from '../widgets/popups/FlightShiftPopup';

interface FlightTableRowProps {
  airman: AirmanModel;
}

export const FlightTableRow = observer((props: FlightTableRowProps) => {
  const {airman} = props;
  return (
    <Link to={`/flights/${airman.id}`}>
      <span className="airman-name airman-attribute">
            {`${airman.lastName}, ${airman.firstName}`}
        </span>
      <span className="airman-attribute airman-shift">
        <ShiftDisplay shift={airman.shift}/>
        <span>{airman.shift}</span>
      </span>
      <span className="airman-attribute airman-schedule">
        {
          airman.currentAirmanSchedule &&
          airman.currentAirmanSchedule.schedule.type
        }
      </span>
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
          this.props.siteManagerStore!.shouldShowSchedulePrompt &&
          <StyledFlightSchedulePopup
            onCancel={this.props.siteManagerStore!.hideSchedulePrompt}
          />
        }
        {
          this.props.siteManagerStore!.shouldShowShiftPrompt &&
          <StyledFlightShiftPopup
            onCancel={this.props.siteManagerStore!.hideShiftPrompt}
          />
        }
        {
          this.props.flights.map(flight => {
            return (
              <div
                id={flight.name}
                className={classNames('flight-table', flight.name, this.props.className)}
                key={flight.id}
              >
                {this.renderHeader(flight)}
                {this.props.siteManagerStore!.shouldExpandFlight(flight.id)
                  && this.renderRows(flight.id)}
                {this.props.siteManagerStore!.shouldExpandFlight(flight.id) &&
                  this.props.siteManagerStore!.shouldAllowFlightDelete(flight.id)
                    && this.renderDeleteFlight(flight.id)}
              </div>
            );
          })
        }
      </React.Fragment>
    );
  }

  private printNumberOfOperators(flight: FlightModel ) {
    const length = this.props.siteManagerStore!
      .getAirmenByFlightId(flight.id)
      .length;
    const numOfOps = length < 10 ?  `0${length}` : length.toString();
    return `${numOfOps} Operators`;
  }

  private renderHeader = (flight: FlightModel) => {
    return (
      <React.Fragment>
      <div className="flight-header">
        <div className="header-section">
          <h3>{flight.name}
            <span>
              {this.printNumberOfOperators(flight)}
            </span>
          </h3>
        </div>
        <div className="header-section">
          <StyledShiftDropdown
            selectedShift={this.props.siteManagerStore!.getShiftByFlightId(flight.id)}
            setShift={(shift: ShiftType) => {
              return this.props.siteManagerActions!.setFlightShift(flight.id, shift);
            }}
            className="shift"
          />
        </div>
        <div className="header-section">
          <StyledDropdown
            onChange={(e) => {
              return this.props.siteManagerActions!.setFlightSchedule(flight.id, Number(e.target.value));
            }}
            name="schedule-select"
            id="schedule-select"
            options={this.props.siteManagerStore!.scheduleOptions}
            value={this.props.siteManagerStore!.getScheduleIdByFlightId(flight.id)}
          />
        </div>
        {!this.props.siteManagerStore!.shouldExpandFlight(flight.id) &&
        <div className="expandFlight" onClick={() => this.props.siteManagerActions!.expandFlight(flight.id)}>
        <ExpandIcon />
        </div>
        }
        {this.props.siteManagerStore!.shouldExpandFlight(flight.id) &&
        <div className="collapseFlight" onClick={() => this.props.siteManagerActions!.collapseFlight(flight.id)}>
        <CollapseIcon />
        </div>
        }
      </div>
      {this.props.siteManagerStore!.shouldExpandFlight(flight.id) &&
      <div className="flight-sub-header">
        <span>NAME</span>
        <span>SHIFT</span>
        <span>SCHEDULE</span>
      </div>}
    </React.Fragment>
    );
  }

  private renderDeleteFlight = (flightId: number) => {
    return (
      <div
        className="delete-flight"
        onClick={async () => {
          this.props.siteManagerStore!.performLoading( async () => {
            await this.props.siteManagerActions!.deleteFlight(flightId);
          });
        }}
      >
        <DeleteIcon />
        <span className="delete-label">Delete Flight</span>
      </div>
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
    
    .collapseFlight, .expandFlight {
      cursor: pointer;
      width:5rem;
      display:flex;
      flex-direction: row-reverse;
    }
    .delete-label {
      margin-left: 0.25rem
    }
    
     
    
    .delete-flight {
    font-size: 0.75rem;
    font-weight: 400;
    cursor: pointer;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    justify-content: center;
    padding: 1.53125rem;
    
    :hover {
      background: ${props => props.theme.light};
      font-weight: 500;
      color: ${props => props.theme.fontColor};
      text-decoration: underline;
    }
  }
    
    .flight-header {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 1rem;
      background: ${props => props.theme.blueSteel};
      
      h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin: 0 5rem 0 0;
        
        span{
          font-weight: 300;
          padding-left: 0.75rem;
          margin: 0 5rem 0 0;
        }
      }
      
      
      .shift {
        width: 5rem;
        border-bottom: 1px solid ${props => props.theme.purpleSteel};
      }
      
      .header-section {
        width: 33%;
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