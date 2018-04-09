import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { AirmanModel } from '../airman/models/AirmanModel';
import { formatAttributes } from '../utils/StyleUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { StyledNotification } from '../widgets/Notification';
import { ShiftDisplay } from '../roster/ShiftDisplay';

interface Props {
  airmen: AirmanModel[];
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

@observer
export class MissionPlannerRoster extends React.Component<Props> {
  render() {
    const {airmen, className} = this.props;
    cache.clearAll();
    return (
        <List
          className={className}
          height={610}
          rowHeight={(props) => cache.rowHeight(props)! || 60}
          rowCount={airmen.length}
          width={866}
          overscanRowCount={15}
          deferredMeasurementCache={cache}
          noRowsRenderer={() => {
            return <StyledNotification>No members at this location match your search.</StyledNotification>;
          }}
          rowRenderer={(props: ListRowProps) => {
            const airman = airmen[props.index];
            return (
              <StyledRow
                {...props}
                key={airman.id}
                airman={airman}
                style={props.style}
              />
            );
          }}
        />
    );
  }
}

export const StyledMissionPlannerRoster = styled(MissionPlannerRoster)`
  border-top: none;
  outline: none;
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
