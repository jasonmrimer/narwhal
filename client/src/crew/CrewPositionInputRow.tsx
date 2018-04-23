import * as React from 'react';
import styled from 'styled-components';
import { StyledCheckbox } from '../widgets/Checkbox';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { FilterOption } from '../widgets/models/FilterOptionModel';
import { inject, observer } from 'mobx-react';
import { NewEntry } from './stores/CrewStore';

export interface CrewStoreContract {
  airmenOptions: FilterOption[];
  newEntry: NewEntry;
}

interface Props {
  crewStore?: CrewStoreContract;
  handleNewEntryCheck: (e: any) => void;
  handleNewEntryChange: (e: any) => void;
  handleTypeahead: (opt: FilterOption) => void;
  className?: string;
}

export const CrewPositionInputRow = observer((props: Props) => {
  const {airmenOptions, newEntry} = props.crewStore!;
  const selectedAirmanOption = airmenOptions.find(opt => {
    return opt.label === newEntry.airmanName;
  });

  return (
    <div className={props.className}>
      <span className="critical">
        <label htmlFor={`critical-new-entry`}>
          <StyledCheckbox
            id={`critical-new-entry`}
            name="critical"
            onChange={props.handleNewEntryCheck}
            checked={newEntry.critical}
          />
        </label>
      </span>
      <span className="position">
        <StyledTextInput
          name="title"
          onChange={props.handleNewEntryChange}
          value={newEntry.title}
        />
      </span>
      <span className="member">
        <StyledSingleTypeahead
          className="airmanSelect"
          options={airmenOptions}
          onChange={props.handleTypeahead}
          selected={selectedAirmanOption ? selectedAirmanOption : {value: '', label: ''}}
          clearButton={!!selectedAirmanOption}
        />
        </span>
    </div>
  );
});

export const StyledCrewPositionInputRow = inject('crewStore')(styled(CrewPositionInputRow)`
  display: flex;
  padding: 0.75rem;
  
  .rbt .rbt-input {
    box-sizing: border-box;
    padding: 0;
    
    input {
      font-weight: 300;
      font-family: 'Roboto', sans-serif;
    }
    
    .rbt-input-main {
      height: unset;
    }
  }
  
  .rbt .close {
    float: none;
    position: unset;
  }
  

  .member {
    width: 50%;
  }
  
  .critical {
    width: 10%;
  }
  
  .position {
    width: 40%;
  }
`);
