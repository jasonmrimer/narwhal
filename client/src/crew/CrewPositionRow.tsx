import * as React from 'react';
import { StyledCheckbox } from '../widgets/inputs/Checkbox';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import styled from 'styled-components';
import { CrewPositionModel } from './models/CrewPositionModel';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';

interface Props {
  crewPosition: CrewPositionModel;
  index: number;
  onCheck: (e: any) => void;
  onChange: (e: any) => void;
  handleDelete: (e: any) => void;
  className?: string;
  airmanName?: string;
}

export const CrewPositionRow = observer((props: Props) => {
  const {crewPosition, index, onCheck, onChange, handleDelete} = props;
  return (
    <div className={classNames('crew-position', props.className)}>
      <span className="critical">
          <StyledCheckbox
            id={`critical-${index}`}
            name="critical"
            onChange={onCheck}
            checked={crewPosition.critical}
          />
      </span>
      <span className="position">
        <StyledTextInput
          name="title"
          value={crewPosition.title || ''}
          onChange={onChange}
        />
      </span>
      <span className="member">
        <span className="airman">
          {props.airmanName === undefined ? '' : props.airmanName}
          </span>
        <button onClick={handleDelete}>×</button>
      </span>
      <span className="remarks">
        <StyledTextInput
          name="remarks"
          value={crewPosition.remarks || ''}
          onChange={onChange}
        />
      </span>
    </div>
  );
});

export const StyledCrewPositionRow = styled(CrewPositionRow)`
  display: flex;
  width: 100%;
  padding: 0.75rem;
 
  &:nth-child(odd) {
    background: ${props => props.theme.dark};
  }
  
  &:nth-child(even) {
    background: ${props => props.theme.light};
  }
    
 .member {
    display: flex;
    justify-content: space-between;
    width: 50%;
    
    button {
      background: none;
      color: ${props => props.theme.fontColor};
      border: none;
      font-size: 1.25rem;
      font-weight: 300;
      padding: 0;
      cursor: pointer;
    }
  }
    
  .critical {
    width: 10%;
    padding: 0 1rem 0 0;
  }
  
  .position {
    width: 40%;
    padding: 0 1rem 0 0;
  }
`;
