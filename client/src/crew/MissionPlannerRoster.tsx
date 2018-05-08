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
  filterAirmen = (airmen: AirmanModel[]) => {
    const {rosterHeaderStore, locationFilterStore} = this.props;
    return rosterHeaderStore!.filterAirmen(locationFilterStore!.filterAirmen(airmen));
  }

  renderWithAvailableAirmen(
    listRowProps: ListRowProps,
    availableAirmen: AirmanModel[],
    unavailableAirmen: AirmanModel[]
  ) {
    const {crewStore} = this.props;

    switch (listRowProps.index) {
      case 0:
        return this.subHeaderRow('AVAILABLE', listRowProps);
      case (availableAirmen.length + 1):
        return this.subHeaderRow('UNAVAILABLE', listRowProps);
      default:
        let airman: AirmanModel;

        if (listRowProps.index < availableAirmen.length + 1) {
          airman = availableAirmen[listRowProps.index - 1];
        } else {
          airman = unavailableAirmen[listRowProps.index - (availableAirmen.length + 2)];
        }

        const addAirman = async () => {
          this.props.crewStore!.setNewEntry({airmanName: `${airman!.lastName}, ${airman!.firstName}`});
          await this.props.missionPlannerActions!.submit();
        };

        return (
          <StyledMissionPlannerRosterRow
            {...listRowProps}
            key={airman!.id}
            airman={airman!}
            style={listRowProps.style}
            onClick={crewStore!.crew!.hasAirman(airman!) ? undefined : addAirman}
          />
        );
    }
  }

  renderWithoutAvailableAirmen(
    listRowProps: ListRowProps,
    availableAirmen: AirmanModel[],
    unavailableAirmen: AirmanModel[]
  ) {
    const {crewStore} = this.props;

    switch (listRowProps.index) {
      case 0:
        return this.subHeaderRow('AVAILABLE', listRowProps);
      case 1:
        return (
          <CellMeasurer {...listRowProps} cache={cache} columnIndex={0}>
            <StyledNotification {...listRowProps}>No personnel currently available.</StyledNotification>
          </CellMeasurer>
        );
      case 2:
        return this.subHeaderRow('UNAVAILABLE', listRowProps);
      default:
        const airman = unavailableAirmen[listRowProps.index - 3];

        const addAirman = async () => {
          this.props.crewStore!.setNewEntry({airmanName: `${airman!.lastName}, ${airman!.firstName}`});
          await this.props.missionPlannerActions!.submit();
        };

        return (
          <StyledMissionPlannerRosterRow
            {...listRowProps}
            key={airman!.id}
            airman={airman!}
            style={listRowProps.style}
            onClick={crewStore!.crew!.hasAirman(airman!) ? undefined : addAirman}
          />
        );
    }
  }

  render() {
    const {missionPlannerStore, className} = this.props;
    const availableAirmen = this.filterAirmen(missionPlannerStore!.availableAirmen);
    const unavailableAirmen = this.filterAirmen(missionPlannerStore!.unavailableAirmen);

    const rowCount  = () => {
      if (availableAirmen.length !== 0 && unavailableAirmen.length !== 0) {
          return availableAirmen.length > 0
            ? 1 + availableAirmen.length + 1 + unavailableAirmen.length
            : 3 + unavailableAirmen.length;
        } else {
          return 0;
        }
    }

    cache.clearAll();
    return (
      <List
        className={className}
        height={610}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={rowCount()}
        width={866}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={() => {
          return <StyledNotification>No members at this location match your search.</StyledNotification>;
        }}
        rowRenderer={
          (props: ListRowProps) => availableAirmen.length > 0
            ? this.renderWithAvailableAirmen(props, availableAirmen, unavailableAirmen)
            : this.renderWithoutAvailableAirmen(props, availableAirmen, unavailableAirmen)
        }
      />
    );
  }

  private subHeaderRow(type: string, listRowProps: ListRowProps) {
    return (
      <CellMeasurer {...listRowProps} cache={cache} columnIndex={0}>
        <StyledRosterSubHeaderRow
          {...listRowProps}
          text={`PERSONNEL BELOW ARE ${type} FOR MISSION ON ${this.props.crewStore!.crew!.mission.displayDateZulu}`}
        />
      </CellMeasurer>
    );
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
      padding: 3.125rem 0;
      margin-bottom: 0;
    }
`);
