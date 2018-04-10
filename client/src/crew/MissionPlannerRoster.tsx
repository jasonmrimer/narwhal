import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { AirmanModel } from '../airman/models/AirmanModel';
import { formatAttributes } from '../utils/StyleUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledNotification } from '../widgets/Notification';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import { MissionModel } from '../mission/models/MissionModel';

interface Props {
  availableAirmen: AirmanModel[];
  unavailableAirmen: AirmanModel[];
  mission: MissionModel;
  className?: string;
}

interface RowProps {
  airman: AirmanModel;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

interface SubHeaderProps {
  text: string;
  style: object;
  index: number;
  parent: any;
  key: any;
  className?: string;
}

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

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

export const SubHeaderRow = observer((props: SubHeaderProps) => {
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      rowIndex={props.index}
      key={props.key}
      parent={props.parent}
    >
      <div className={props.className} style={props.style}>{props.text}</div>
    </CellMeasurer>
  );
});

@observer
export class MissionPlannerRoster extends React.Component<Props> {
  renderRow = (props: ListRowProps) => {
    const {mission, availableAirmen, unavailableAirmen} = this.props;

    if (props.index === 0) {
      return (
        <StyledSubHeaderRow
          {...props}
          text={`PERSONNEL BELOW ARE AVAILABLE FOR MISSION ON ${mission.startDateTime.format('DD MMM YY')
            .toUpperCase()}`}
        />
      );
    } else if (props.index === availableAirmen.length + 1) {
      return (
        <StyledSubHeaderRow
          {...props}
          text={`PERSONNEL BELOW ARE UNAVAILABLE FOR MISSION ON ${mission.startDateTime.format('DD MMM YY')
            .toUpperCase()}`}
        />
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
    const {availableAirmen, unavailableAirmen, className} = this.props;
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
        rowRenderer={this.renderRow}
      />
    );
  }
}

export const StyledMissionPlannerRoster = styled(MissionPlannerRoster)`
  border-top: none;
  outline: none;
`;

export const StyledSubHeaderRow = styled(SubHeaderRow)`
  display: flex;
  justify-content: center;
  background: ${props => props.theme.blueSteel};
  border-right: 1px solid ${props => props.theme.graySteel};
  border-left: 1px solid ${props => props.theme.graySteel};
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 200;
`;

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
