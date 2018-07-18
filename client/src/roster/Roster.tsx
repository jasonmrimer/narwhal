import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel, ShiftType } from '../airman/models/AirmanModel';
import { TabType } from '../tracker/stores/SidePanelStore';
import { StyledAirmanDatum } from '../tracker/AirmanDatum';
import { StyledPlanner } from './Planner';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import * as classNames from 'classnames';
import { StyledShiftDropdown } from '../tracker/ShiftDropdown';
import { BorderedNotification, EmptyBorderedNotification } from '../widgets/Notification';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { RosterHeaderStore } from './stores/RosterHeaderStore';
import { RosterList } from './models/RosterList';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';
import { FlightModel } from '../flight/model/FlightModel';
import { SidePanelActions } from '../tracker/SidePanelActions';
import { StyledSkillsField } from '../skills/SkillsField';
import { PlannerStore } from './stores/PlannerStore';

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

interface Props {
  trackerStore?: TrackerStore;
  locationFilterStore?: LocationFilterStore;
  rosterHeaderStore?: RosterHeaderStore;
  className?: string;
}

@observer
export class Roster extends React.Component<Props> {
  airmen = () => {
    const airmen = this.props.locationFilterStore!.filterAirmen(this.props.trackerStore!.airmen);
    return this.props.rosterHeaderStore!.filterAirmen(airmen);
  };

  render() {
    const {className} = this.props;
    const squadron = this.props.locationFilterStore!.selectedSquadron;
    const selectedFlightId = this.props.locationFilterStore!.selectedFlightId;
    const list = new RosterList(selectedFlightId, squadron, this.airmen());

    cache.clearAll();

    return (
      <List
        className={className}
        height={855}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={list.size}
        width={1400}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={() => {
          return this.props.locationFilterStore!.selectedSiteId === null ?
            this.renderSiteWarning() :
            this.renderNone();
        }}
        rowRenderer={(props: ListRowProps) => {
          const item = list.get(props.index);
          if (item instanceof AirmanModel) {
            return this.renderAirmanRow(props, item as AirmanModel);
          } else if (item instanceof FlightModel) {
            return this.renderFlightRow(props, item as FlightModel);
          } else {
            return this.renderEmptyRow(props, item as string);
          }
        }}
      />
    );
  }

  private renderSiteWarning = () => {
    return (
      <BorderedNotification>
        Please select a site to search.
      </BorderedNotification>
    );
  };

  private renderNone = () => {
    return (
      <BorderedNotification>
        No members at this location match your search.
      </BorderedNotification>
    );
  };

  private renderAirmanRow = (props: ListRowProps, airman: AirmanModel) => {
    return (
      <StyledRow
        {...props}
        key={airman.id}
        airman={airman}
        style={props.style}
      />
    );
  };

  private renderFlightRow = (props: ListRowProps, flight: FlightModel) => {
    return (
      <CellMeasurer {...props} cache={cache} columnIndex={0}>
        <StyledRosterSubHeaderRow {...props} alignment="left">
          {flight.name}
        </StyledRosterSubHeaderRow>
      </CellMeasurer>
    );
  };

  private renderEmptyRow = (props: ListRowProps, message: string) => {
    return (
      <CellMeasurer {...props} cache={cache} columnIndex={0}>
        <div style={props.style}>
          <EmptyBorderedNotification>
            {message}
          </EmptyBorderedNotification>
        </div>
      </CellMeasurer>
    );
  };
}

export const StyledRoster = inject(
  'trackerStore',
  'locationFilterStore',
  'rosterHeaderStore'
)(styled(Roster)`
  border-top: none;
  outline: none;
`);

interface RowProps {
  airman: AirmanModel;
  trackerStore?: TrackerStore;
  sidePanelActions?: SidePanelActions;
  plannerStore?: PlannerStore;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

const Row = observer(
  (props: RowProps) => {
    const {airman, trackerStore, className, plannerStore} = props;
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={props.index}
        key={props.key}
        parent={props.parent}
      >
        <div
          className={classNames(className, {selected: airman.id === trackerStore!.selectedAirman.id})}
          style={Object.assign({}, props.style, {width: '1400px'})}
        >
          <div
            className="left"
            onClick={async () => await props.sidePanelActions!.openSidePanel(airman, TabType.CURRENCY)}
          >
            <StyledShiftDropdown
              className="shift"
              selectedShift={airman.shift}
              setShift={(shift: ShiftType) => {
                return trackerStore!.updateAirmanShift(airman, shift);
              }}
            />
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.AVAILABILITY}
              className="airman-name"
            >
              <span>{airman.lastName}, {airman.firstName}</span>
            </StyledAirmanDatum>
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.CURRENCY}
              className="airman-qual"
            >
              <StyledSkillsField items={airman.qualifications}/>
            </StyledAirmanDatum>
            <StyledAirmanDatum
              airman={airman}
              tab={TabType.CURRENCY}
              className="airman-cert"
            >
              <StyledSkillsField items={airman.certifications}/>
            </StyledAirmanDatum>
          </div>
          <div
            className="right"

          >
            <StyledPlanner
              airman={airman}
              plannerWeek={plannerStore!.plannerTimeSpan}
            />
          </div>
        </div>
      </CellMeasurer>
    );
  }
);

export const StyledRow = inject(
  'trackerStore',
  'sidePanelActions',
  'plannerStore'
)(styled(Row)`
  display: flex;
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  
  &:nth-child(even) {
    background-color: ${props => props.theme.light};
  } 
  
  &:nth-child(odd) {
    background-color: ${props => props.theme.dark};
  }
  
  &:hover {
    background: ${props => props.theme.darkest};
  }
  
  .left > div > span {
    width: 11.75rem;
  }
  
  .right > div > span {
    width: 11.75rem;
  }
  
  .left {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.graySteel};
  }
  
  .right { 
    display: flex;
    flex-grow: 2;
    align-items: center;
    padding: 0 0.75rem;
    cursor: pointer;
  }
  
  .shift {
    width: 6rem;
    padding: 0 0.5rem;
  }
  
  &.selected {
    box-shadow: inset 0.5rem 0 0 ${props => props.theme.yellow};
  }
  nav {
    width: 50%;
    padding: 0.75rem 0.375rem;
  }
`);
