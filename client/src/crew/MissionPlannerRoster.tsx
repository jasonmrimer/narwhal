import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { AirmanModel } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { StyledNotification } from '../widgets/Notification';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';
import { RosterHeaderStore } from '../roster/stores/RosterHeaderStore';
import { LocationFilterStore } from '../widgets/stores/LocationFilterStore';
import { CrewStore } from './stores/CrewStore';
import { MissionPlannerStore } from './stores/MissionPlannerStore';
import { MissionPlannerActions } from './MissionPlannerActions';
import { EmptyNotification, MissionPlannerRosterList, SubHeader } from './models/MissionPlannerRosterList';
import { StyledMissionPlannerRosterRow } from './MissionPlannerRosterRow';

export const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

interface Props {
  missionPlannerStore?: MissionPlannerStore;
  crewStore?: CrewStore;
  locationFilterStore?: LocationFilterStore;
  rosterHeaderStore?: RosterHeaderStore;
  missionPlannerActions?: MissionPlannerActions;
  className?: string;
}

@observer
export class MissionPlannerRoster extends React.Component<Props> {
  render() {
    const {missionPlannerStore, rosterHeaderStore, locationFilterStore, className} = this.props;
    const list = new MissionPlannerRosterList(
      missionPlannerStore!.availableAirmen,
      missionPlannerStore!.unavailableAirmen,
      rosterHeaderStore!.filterAirmen,
      locationFilterStore!.filterAirmen
    );
    cache.clearAll();
    return (
      <List
        className={className}
        height={610}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={list.size}
        width={866}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={this.renderNone}
        rowRenderer={(props: ListRowProps) => this.renderRow(props, list)}
      />
    );
  }

  private renderNone = () => {
    return (
      <StyledNotification className="failed-search">
        No members at this location match your search.
      </StyledNotification>
    );
  }

  private renderRow = (props: ListRowProps, list: MissionPlannerRosterList) => {
    const item = list.get(props.index);
    switch (item.constructor) {
      case SubHeader:
        const header = item as SubHeader;
        return (
          <CellMeasurer {...props} cache={cache} columnIndex={0}>
            <StyledRosterSubHeaderRow style={props.style}>
              PERSONNEL BELOW ARE
              &nbsp;<b>{header.text()}</b>&nbsp;
              FOR MISSION ON {this.props.crewStore!.crew!.mission.displayDateZulu}
            </StyledRosterSubHeaderRow>
          </CellMeasurer>
        );
      case AirmanModel:
        const airman = item as AirmanModel;
        return (
          <StyledMissionPlannerRosterRow
            {...props}
            key={airman.id}
            airman={airman}
            onCrew={this.props.crewStore!.crew!.hasAirman(airman)}
            onClick={async () => await this.props.missionPlannerActions!.addAirman(airman)}
          />
        );
      case EmptyNotification:
        const note = item as EmptyNotification;
        return (
          <CellMeasurer {...props} cache={cache} columnIndex={0}>
            <StyledNotification className={props.index === list.size - 1 ? 'failed-search' : ''} style={props.style}>
              {note.text}
            </StyledNotification>
          </CellMeasurer>
        );
      default:
        return null;
    }
  }
}

export const StyledMissionPlannerRoster =
  inject(
    'missionPlannerStore',
    'crewStore',
    'locationFilterStore',
    'rosterHeaderStore',
    'missionPlannerActions',
  )(styled(MissionPlannerRoster)`
    border-top: none;
    outline: none;
    
    h3 {
      border-left: 1px solid ${props => props.theme.graySteel};
      border-right: 1px solid ${props => props.theme.graySteel};
      padding: 3.125rem 0;
      margin-bottom: 0;
    }
    
    .failed-search {
      border-bottom: 1px solid ${props => props.theme.graySteel};
    }
`);
