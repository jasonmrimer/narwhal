import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { AirmanModel } from '../airman/models/AirmanModel';
import { formatAttributes } from '../utils/StyleUtils';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { StyledNotification } from '../widgets/Notification';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { CrewModel } from './models/CrewModel';
import { StyledRosterSubHeaderRow } from '../widgets/RosterSubHeaderRow';

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

export interface MissionPlannerStoreContract {
  availableAirmen: AirmanModel[];
  unavailableAirmen: AirmanModel[];
}

export interface CrewStoreContract {
  crew: CrewModel;
}

export interface LocationFilterStoreContract {
  filterAirmen: (airmen: AirmanModel[]) => AirmanModel[];
}

export interface RosterHeaderStoreContract {
  filterAirmen: (airmen: AirmanModel[]) => AirmanModel[];
}

interface Props {
  missionPlannerStore?: MissionPlannerStoreContract;
  crewStore?: CrewStoreContract;
  locationFilterStore?: LocationFilterStoreContract;
  rosterHeaderStore?: RosterHeaderStoreContract;
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
    return (
      <StyledRow
        {...props}
        key={airman.id}
        airman={airman}
        style={props.style}
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
  )(styled(MissionPlannerRoster)`
    border-top: none;
    outline: none;
`);

interface RowProps {
  airman: AirmanModel;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

export const Row = observer((props: RowProps) => {
  const {airman, className} = props;
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      rowIndex={props.index}
      key={props.key}
      parent={props.parent}
    >
      <div className={className} style={props.style}>
        <div className="airman-row">
          <span className="airman-shift"><ShiftDisplay shift={props.airman.shift}/></span>
          <span className="airman-name">{`${airman.lastName}, ${airman.firstName}`}</span>
          <span className="airman-qual">{formatAttributes(airman.qualifications, 'acronym')}</span>
          <span className="airman-cert">{formatAttributes(airman.certifications, 'title')}</span>
        </div>
      </div>
    </CellMeasurer>
  );
});

export const StyledRow = styled(Row)`
  .airman-row {
    width: 866px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    cursor: initial;
    border-left: 1px solid ${props => props.theme.graySteel};
    border-right: 1px solid ${props => props.theme.graySteel};
  }
  
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }
  
  &:nth-child(odd) {
    background: ${props => props.theme.dark};
  }
  
  &:nth-child(even) {
    background: ${props => props.theme.light};
  }
  
  &:hover {
    background: ${props => props.theme.darkest};
  }
  
  .airman-name, .airman-qual, .airman-cert {
    width: 23%;
  }
  
  .airman-shift {
    width: 5rem;
  }
`;
