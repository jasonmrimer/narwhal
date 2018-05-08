import * as React from 'react';
import { formatAttributes } from '../utils/StyleUtils';
import { AirmanModel } from '../airman/models/AirmanModel';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { cache } from './MissionPlannerRoster';
import { CellMeasurer } from 'react-virtualized';
import { ShiftDisplay } from '../roster/ShiftDisplay';
import * as classNames from 'classnames';
import { PlusIcon } from '../icons/PlusIcon';

interface Props {
  airman: AirmanModel;
  onCrew: boolean;
  style: object;
  index: number;
  parent: any;
  key: any;
  onClick?: () => void;
  className?: string;
}

export const MissionPlannerRosterRow = observer((props: Props) => {
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
        <div onClick={props.onClick} className={classNames('airman-row', {clickable: !props.onCrew})}>
          <span className="airman-shift"><ShiftDisplay shift={props.airman.shift}/></span>
          <span className="airman-name">
            {!props.onCrew && <PlusIcon/>}
            <span>{`${airman.lastName}, ${airman.firstName}`}</span>
          </span>
          <span className="airman-qual">{formatAttributes(airman.qualifications, 'acronym')}</span>
          <span className="airman-cert">{formatAttributes(airman.certifications, 'title')}</span>
        </div>
      </div>
    </CellMeasurer>
  );
});

export const StyledMissionPlannerRosterRow = styled(MissionPlannerRosterRow)`
  .clickable {
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.darkest};
    }
  }
  
  .airman-row {
    width: 866px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
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
    
  .airman-name, .airman-qual, .airman-cert {
    width: 23%;
  }
  
  .airman-name {
    align-items: center;
    display: flex;
    & > svg {
      margin-right: 0.5rem;
    }
  }
  
  .airman-shift {
    width: 5rem;
  }
`;
