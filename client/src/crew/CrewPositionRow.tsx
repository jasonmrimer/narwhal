import * as React from 'react';
import { StyledCheckbox } from '../widgets/inputs/Checkbox';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import styled from 'styled-components';
import { CrewPositionModel } from './models/CrewPositionModel';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';
import { CloseIcon } from '../icons/CloseIcon';

interface Props {
  crewPosition: CrewPositionModel;
  index: number;
  onCheck: (e: any) => void;
  onChange: (e: any) => void;
  handleDelete: (e: any) => void;
  className?: string;
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
        <span className="airman">{crewPosition.displayFullName}</span>
      </span>
      <span className="remarks">
        <StyledTextInput
          name="remarks"
          value={crewPosition.remarks || ''}
          onChange={onChange}
        />
      </span>
      {
        crewPosition.displayFullName !== '' &&
        <button onClick={handleDelete}>{<CloseIcon/>}</button>
      }
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
    
  .critical {
    width: 10%;
    padding: 0 1rem 0 0;
    margin-right: 2rem;
  }
  
  .position {
    width: 20%;
    padding: 0 2rem 0 0;
  }
  
  .member {
    width: 50%;
    padding: 0 1rem 0 0;
  }
  
  .remarks {
    padding-right: 1rem;
  }
  
   button {
      background: none;
      color: ${props => props.theme.fontColor};
      border: none;
      padding: 0;
      cursor: pointer;
    }
`;
