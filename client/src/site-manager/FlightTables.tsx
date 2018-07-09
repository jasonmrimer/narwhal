import * as React from 'react';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { ShiftDisplay } from '../roster/ShiftDisplay';
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
import { StyledCheckbox } from '../widgets/inputs/Checkbox';
import { FlightAirmanSelectionStore } from './stores/FlightAirmanSelectionStore';
import { Selectable } from './models/Selectable';
import { ProfileIcon } from '../icons/ProfileIcon';
import { Link } from 'react-router-dom';
import { OperatorIcon } from '../icons/OperatorIcon';
import { StyledFlightTableRow } from './FlightTableRow';

interface Props {
  flights: FlightModel[];
  flightAirmanSelectionStore?: FlightAirmanSelectionStore;
  siteManagerStore?: SiteManagerStore;
  siteManagerActions?: SiteManagerActions;
  className?: string;
}

@observer
export class FlightTables extends React.Component<Props> {
  render() {
    const {flights, flightAirmanSelectionStore, siteManagerStore, className} = this.props;
    return (
      <React.Fragment>
        {
          siteManagerStore!.shouldShowSchedulePrompt &&
          <StyledFlightSchedulePopup
            onCancel={siteManagerStore!.hideSchedulePrompt}
            count={
              flightAirmanSelectionStore!.getSelections(
                siteManagerStore!.getAirmenByFlightId(
                  siteManagerStore!.pendingFlightId!
                )
              ).length
            }
          />
        }
        {
          siteManagerStore!.shouldShowShiftPrompt &&
          <StyledFlightShiftPopup
            onCancel={siteManagerStore!.hideShiftPrompt}
            count={
              flightAirmanSelectionStore!.getSelections(
                siteManagerStore!.getAirmenByFlightId(
                  siteManagerStore!.pendingFlightId!
                )
              ).length
            }
          />
        }
        {
          flights.map(flight => {
            const flightAirmen = siteManagerStore!.getAirmenByFlightId(flight.id);
            return (
              <div
                id={flight.name}
                className={classNames('flight-table', flight.name, className)}
                key={flight.id}
              >
                {this.renderHeader(flight, flightAirmen)}
                {siteManagerStore!.shouldExpandFlight(flight.id)
                && this.renderRows(flight.id, flightAirmen)}
                {siteManagerStore!.shouldExpandFlight(flight.id) &&
                siteManagerStore!.shouldAllowFlightDelete(flight.id)
                && this.renderDeleteFlight(flight.id)}
              </div>
            );
          })
        }
      </React.Fragment>
    );
  }

  private renderHeader = (flight: FlightModel, airmen: Selectable<AirmanModel>[]) => {
    const {flightAirmanSelectionStore, siteManagerStore, siteManagerActions} = this.props;
    return (
      <React.Fragment>
        <div className="flight-header">
          <div className="header-section">
            <h3>{flight.name}</h3>
            <span>
              {this.printNumberOfOperators(flight)}
            </span>
            <span>
              <ProfileIcon/>
            </span>
          </div>
          <div className="header-section">
            {
              !siteManagerStore!.shouldExpandFlight(flight.id) ?
                <div className="shift-label">
                  <ShiftDisplay shift={siteManagerStore!.getShiftByFlightId(flight.id)!}/>
                  {siteManagerStore!.getShiftByFlightId(flight.id)}
                </div> :
                <StyledShiftDropdown
                  selectedShift={siteManagerStore!.getShiftByFlightId(flight.id)}
                  setShift={(shift: ShiftType) => {
                    return siteManagerActions!.setFlightShift(flight.id, shift);
                  }}
                  className="shift"
                />
            }
          </div>

          <div className="header-section">
            {
              !siteManagerStore!.shouldExpandFlight(flight.id) ?
                <div>{this.flightScheduleLabel(flight)}</div> :
                <StyledDropdown
                  onChange={(e) => {
                    return siteManagerActions!.setFlightSchedule(flight.id, Number(e.target.value));
                  }}
                  name="schedule-select"
                  id="schedule-select"
                  options={siteManagerStore!.scheduleOptions}
                  value={siteManagerStore!.getScheduleIdByFlightId(flight.id)}
                />
            }
          </div>

          <div className="new-operator-button">
            {
              siteManagerStore!.shouldExpandFlight(flight.id) &&
              <Link to="/flights/new">
                <OperatorIcon/>
                <div>New Operator</div>
              </Link>
            }
          </div>

          {
            !siteManagerStore!.shouldExpandFlight(flight.id) &&
            <div className="expandFlight" onClick={() => siteManagerActions!.expandFlight(flight.id)}>
              <ExpandIcon/>
            </div>
          }

          {
            siteManagerStore!.shouldExpandFlight(flight.id) &&
            <div className="collapseFlight" onClick={() => siteManagerActions!.collapseFlight(flight.id)}>
              <CollapseIcon/>
            </div>
          }
        </div>
        {siteManagerStore!.shouldExpandFlight(flight.id) &&
        <div className="flight-sub-header">
          <span className="selection">
          <StyledCheckbox
            name={'checkbox-flight-' + flight.id}
            onChange={() => flightAirmanSelectionStore!.toggleAll(airmen)}
            checked={flightAirmanSelectionStore!.areSelected(airmen)}
          />
          </span>
          <span>
             NAME
          </span>
          <span>SHIFT</span>
          <span>SCHEDULE</span>
        </div>}
      </React.Fragment>
    );
  };

  private renderDeleteFlight = (flightId: number) => {
    return (
      <div
        className="delete-flight"
        onClick={async () => {
          await this.props.siteManagerStore!.performLoading(async () => {
            await this.props.siteManagerActions!.deleteFlight(flightId);
          });
        }}
      >
        <DeleteIcon/>
        <span className="delete-label">Delete Flight</span>
      </div>
    );
  };
  private renderRows = (flightId: number, airmen: Selectable<AirmanModel>[]) => {
    return airmen.map((airman) => {
      return (
        <StyledFlightTableRow
          key={airman.model.id}
          airman={airman}
        />
      );
    });
  };

  private flightScheduleLabel(flight: FlightModel) {
    const scheduleIdByFlightId = this.props.siteManagerStore!.getScheduleIdByFlightId(flight.id);
    if (scheduleIdByFlightId) {
      return this.props.siteManagerStore!.schedules.find(s => s.id === Number(scheduleIdByFlightId))!.type;
    }
    return 'No Schedule';
  }

  private printNumberOfOperators(flight: FlightModel) {
    const length = this.props.siteManagerStore!
      .getAirmenByFlightId(flight.id)
      .length;
    const numOfOps = length < 10 ? `0${length}` : length.toString();
    return `${numOfOps}`;
  }
}

export const StyledFlightTables = inject(
  'siteManagerStore',
  'siteManagerActions',
  'flightAirmanSelectionStore'
)(styled(FlightTables)`    
    border: 1px solid ${props => props.theme.graySteel};
    margin-bottom: 2rem;
    
    .collapseFlight, .expandFlight {
      cursor: pointer;
      width: 1rem;
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
      padding: 1rem;
      background: ${props => props.theme.blueSteel};
      justify-content: space-around;
      
      h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-right: 0.25rem;
        display: inline;   
        vertical-align: middle;    
      }
      
      span {
          font-size: 1.25rem;
          font-weight: 300;
          margin: 0 0.25rem 0 0;
          vertical-align: middle;
        }
      
      
      .shift {
        width: 5rem;
        border-bottom: 1px solid ${props => props.theme.purpleSteel};
      }
      
      .header-section {
        width: 20%;
        
        .shift-label {
          & > svg {
             margin-right: 0.25rem;
          }
        }
      }
      
      .new-operator-button {
        display: flex;
        justify-content: flex-end;
        width: 30%;
        font-size: 1rem;
        
        div {
          margin-left: 0.25rem;
          display: inline;
        }
      }
    }
        
  .flight-sub-header {
    background-color: ${props => props.theme.lightest};
    padding: 1rem;
    display: flex;
    & input[checkbox] {
      padding-right: 0.25rem;
    }
    
    & > span {
      width: 32%;
      justify-content: space-evenly;
    }
    
    .selection {
      width: 4%;
      padding: 1px;
    }
  }
`);