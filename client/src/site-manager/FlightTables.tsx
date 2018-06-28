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
import { Checkbox } from '../widgets/inputs/Checkbox';
import { FlightAirmanSelectionStore } from './stores/FlightAirmanSelectionStore';
import { HierarchySelectionModel } from '../airman/models/HierarchySelectionModel';

interface FlightTableRowProps {
  airman: AirmanModel;
  flightAirmanSelectionStore: FlightAirmanSelectionStore;
  flightSelections: HierarchySelectionModel;
}

export const FlightTableRow = observer((props: FlightTableRowProps) => {
  const {airman, flightAirmanSelectionStore, flightSelections} = props;

  return (
    <React.Fragment>
    <Checkbox
      name={'checkbox-airman-' + airman.id}
      onChange={() => {flightAirmanSelectionStore!.toggleChild(flightSelections, airman.id);}}
      checked={flightAirmanSelectionStore!.isChildSelected(flightSelections, airman.id)}
    />
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
    </React.Fragment>
  );
});

interface FlightTablesProps {
  flights: FlightModel[];
  flightAirmanSelectionStore?: FlightAirmanSelectionStore;
  siteManagerStore?: SiteManagerStore;
  siteManagerActions?: SiteManagerActions;
  className?: string;
}

@observer
export class FlightTables extends React.Component<FlightTablesProps> {
  render() {
    const {
      flights,
      flightAirmanSelectionStore,
      siteManagerStore,
      className
    } = this.props;

    return (
      <React.Fragment>
        {
          siteManagerStore!.shouldShowSchedulePrompt &&
          <StyledFlightSchedulePopup
            onCancel={siteManagerStore!.hideSchedulePrompt}
          />
        }
        {
          siteManagerStore!.shouldShowShiftPrompt &&
          <StyledFlightShiftPopup
            onCancel={siteManagerStore!.hideShiftPrompt}
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
                  && this.renderRows(flight.id, flightAirmen, flightAirmanSelectionStore!)}
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

  private printNumberOfOperators(flight: FlightModel ) {
    const length = this.props.siteManagerStore!
      .getAirmenByFlightId(flight.id)
      .length;
    const numOfOps = length < 10 ?  `0${length}` : length.toString();
    return `${numOfOps} Operators`;
  }

  private renderHeader = (flight: FlightModel, airmen: AirmanModel[]) => {
    const airmenIds = airmen.map(a => a.id);
    const {
      flightAirmanSelectionStore,
      siteManagerStore,
      siteManagerActions
      } = this.props;
    return (
      <React.Fragment>
      <div className="flight-header">
        <div className="header-section">
          <Checkbox
            name={'checkbox-flight-' + flight.id}
            onChange={
              () => {flightAirmanSelectionStore!.toggleParent(flight.id, airmenIds);}}
            checked={flightAirmanSelectionStore!.isParentSelected(flight.id, airmenIds)}
          />
        </div>
        <div className="header-section">
          <h3>{flight.name}
            <span>
              {this.printNumberOfOperators(flight)}
            </span>
          </h3>
        </div>
        <div className="header-section">
          <StyledShiftDropdown
            selectedShift={siteManagerStore!.getShiftByFlightId(flight.id)}
            setShift={(shift: ShiftType) => {
              return siteManagerActions!.setFlightShift(flight.id, shift);
            }}
            className="shift"
          />
        </div>
        <div className="header-section">
          <StyledDropdown
            onChange={(e) => {
              return siteManagerActions!.setFlightSchedule(flight.id, Number(e.target.value));
            }}
            name="schedule-select"
            id="schedule-select"
            options={siteManagerStore!.scheduleOptions}
            value={siteManagerStore!.getScheduleIdByFlightId(flight.id)}
          />
        </div>
        {!siteManagerStore!.shouldExpandFlight(flight.id) &&
        <div className="expandFlight" onClick={() => siteManagerActions!.expandFlight(flight.id)}>
        <ExpandIcon />
        </div>
        }
        {siteManagerStore!.shouldExpandFlight(flight.id) &&
        <div className="collapseFlight" onClick={() => siteManagerActions!.collapseFlight(flight.id)}>
        <CollapseIcon />
        </div>
        }
      </div>
      {siteManagerStore!.shouldExpandFlight(flight.id) &&
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

  private renderRows = (flightId: number, airmen: AirmanModel[], flightAirmanSelectionStore: FlightAirmanSelectionStore) => {
    const flightSelections = flightAirmanSelectionStore.findParent(flightId);
    return airmen.map((airman) => {
        return <FlightTableRow
          key={airman.id}
          airman={airman}
          flightSelections={flightSelections}
          flightAirmanSelectionStore={flightAirmanSelectionStore}
        />;
      });
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