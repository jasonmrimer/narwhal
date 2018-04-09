import * as React from 'react';
import styled from 'styled-components';
import { StyledCheckbox } from './widgets/Checkbox';
import { StyledTextInput } from './widgets/TextInput';
import { StyledSingleTypeahead } from './widgets/SingleTypeahead';
import { CrewStore } from './crew/stores/CrewStore';
import { FilterOption } from './widgets/models/FilterOptionModel';
import { observer } from 'mobx-react';

interface Props {
  crewStore: CrewStore;
  handleNewEntryCheck: (e: any) => void;
  handleNewEntryChange: (e: any) => void;
  handleTypeahead: (opt: FilterOption) => void;
  className?: string;
}

export const CrewPositionInputRow = observer((props: Props) => {
  const selectedAirmanOption = props.crewStore.airmenOptions.find(opt => {
    return opt.label === props.crewStore.newEntry.airmanName;
  });

  return (
    <div
      className={props.className}
      onKeyPress={async (e) => {
        if (e.key === 'Enter') {
          await props.crewStore.save();
        }
      }}
    >
      <span className="critical">
        <label htmlFor={`critical-new-entry`}>
          <StyledCheckbox
            id={`critical-new-entry`}
            name="critical"
            onChange={props.handleNewEntryCheck}
            checked={props.crewStore.newEntry.critical}
          />
        </label>
      </span>
      <span className="position">
        <StyledTextInput
          name="title"
          onChange={props.handleNewEntryChange}
          value={props.crewStore.newEntry.title}
        />
      </span>
      <span className="member">
        <StyledSingleTypeahead
          className="airmanSelect"
          options={props.crewStore.airmenOptions}
          onChange={props.handleTypeahead}
          placeholder={''}
          selected={selectedAirmanOption ? selectedAirmanOption : {value: '', label: ''}}
          clearButton={!!selectedAirmanOption}
        />
        </span>
    </div>
  );
});

export const StyledCrewPositionInputRow = styled(CrewPositionInputRow)`
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
`;
