import * as React from 'react';

import { CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AirmanModel } from '../airman/models/AirmanModel';
import { formatAttributes } from '../utils/StyleUtils';
import { TabType } from '../tracker/stores/SidePanelStore';
import { AirmanDatum } from '../tracker/AirmanDatum';
import { StyledPlanner } from './Planner';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';
import { StyledShiftDropdown } from '../ShiftDropdown';
import { StyledNotification } from '../widgets/Notification';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface RowProps {
  airman: AirmanModel;
  trackerStore: TrackerStore;
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

const Row = observer((props: RowProps) => {
  const {airman, trackerStore, className} = props;
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      rowIndex={props.index}
      key={props.key}
      parent={props.parent}
    >
      <div
        className={classNames(className, {selected: airman.id === trackerStore.selectedAirman.id})}
        style={props.style}
      >
        <div
          className="left"
          onClick={() => trackerStore.setSelectedAirman(airman, TabType.AVAILABILITY)}
        >
          <StyledShiftDropdown
            airman={airman}
            trackerStore={trackerStore}
            className="shift"
          />
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={`${airman.lastName}, ${airman.firstName}`}
            tab={TabType.AVAILABILITY}
            className="airman-name"
          />
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={formatAttributes(airman.qualifications, 'acronym')}
            tab={TabType.CURRENCY}
            className="airman-qual"
          />
          <AirmanDatum
            trackerStore={trackerStore}
            airman={airman}
            text={formatAttributes(airman.certifications, 'title')}
            tab={TabType.CURRENCY}
            className="airman-cert"
          />
        </div>
        <div
          className="right"
          onClick={() => trackerStore.setSelectedAirman(airman, TabType.AVAILABILITY)}
        >
          <StyledPlanner
            week={trackerStore.plannerStore.plannerWeek}
            trackerStore={trackerStore}
            airman={airman}
          />
        </div>
      </div>
    </CellMeasurer>
  );
});

@observer
export class Roster extends React.Component<Props> {
  render() {
    const {trackerStore, className} = this.props;
    cache.clearAll();
    return (
      <List
        className={className}
        height={900}
        rowHeight={(props) => cache.rowHeight(props)! || 60}
        rowCount={trackerStore.airmen.length}
        width={1400}
        overscanRowCount={15}
        deferredMeasurementCache={cache}
        noRowsRenderer={() => {
          return <StyledNotification>No members at this location match your search.</StyledNotification>;
        }}
        rowRenderer={(props: ListRowProps) => {
          const airman = trackerStore.airmen[props.index];
          return (
            <StyledRow
              {...props}
              key={airman.id}
              airman={airman}
              style={props.style}
              trackerStore={trackerStore}
            />
          );
        }}
      />
    );
  }
}

export const StyledRoster = styled(Roster)`
  border-top: none;
  outline: none;
`;

export const StyledRow = styled(Row)`
  display: flex;
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  
  &:nth-child(even) {
    background-color: ${props => props.theme.lighter};
  }
  
  &:hover {
    background: ${props => props.theme.darkest};
  }
  
  & > div > span {
    width: 23%;
  }
  
  .left {
    width: 868px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    cursor: pointer;
    border-right: 1px solid ${props => props.theme.graySteel};
  }
  
  .right { 
    display: flex;
    flex-grow: 2;
    align-items: center;
    padding: 0.75rem;
    cursor: pointer;
  }
  
  .shift {
    width: 5rem;
  }
  
  &.selected {
    box-shadow: inset 0.5rem 0px 0px ${props => props.theme.yellow};
  }
`;
