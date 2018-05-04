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

  renderRow = (props: ListRowProps, availableAirmen: AirmanModel[], unavailableAirmen: AirmanModel[]) => {
    const {crewStore} = this.props;
    const {crew} = crewStore!;

    if (props.index === 0 || props.index === availableAirmen.length + 1) {
      const text = props.index === 0 ?
        `PERSONNEL BELOW ARE AVAILABLE FOR MISSION ON ${crew!.mission.displayDateZulu}` :
        `PERSONNEL BELOW ARE UNAVAILABLE FOR MISSION ON ${crew!.mission.displayDateZulu}`;
      return (
        <CellMeasurer {...props} cache={cache} columnIndex={0}>
          <StyledRosterSubHeaderRow {...props} text={text}/>
        </CellMeasurer>
      );
    }

    let airman: AirmanModel;
    if (props.index < availableAirmen.length + 1) {
      airman = availableAirmen[props.index - 1];
    } else {
      airman = unavailableAirmen[props.index % (availableAirmen.length + 2)];
    }

    const addAirman = async () => {
      this.props.crewStore!.setNewEntry({airmanName: `${airman.lastName}, ${airman.firstName}`});
      await this.props.missionPlannerActions!.submit();
    };

    return (
      <StyledMissionPlannerRosterRow
        {...props}
        key={airman.id}
        airman={airman}
        style={props.style}
        onClick={crewStore!.crew!.hasAirman(airman) ? undefined : addAirman}
      />
    );
  }

  render() {
    const {missionPlannerStore, className} = this.props;
    const availableAirmen = this.filterAirmen(missionPlannerStore!.availableAirmen);
    const unavailableAirmen = this.filterAirmen(missionPlannerStore!.unavailableAirmen);

    cache.clearAll();
    return (
      <List
        className={className}
        height={610}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={1 + availableAirmen.length + 1 + unavailableAirmen.length}
        width={866}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={() => {
          return <StyledNotification>No members at this location match your search.</StyledNotification>;
        }}
        rowRenderer={(props: ListRowProps) => this.renderRow(props, availableAirmen, unavailableAirmen)}
      />
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
`);
