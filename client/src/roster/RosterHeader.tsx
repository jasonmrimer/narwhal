import * as React from 'react';
import { RosterLevelFilter } from '../widgets/inputs/Filter';
import { StyledTextInput } from '../widgets/inputs/TextInput';
import { StyledMultiTypeahead } from '../widgets/inputs/MultiTypeahead';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { FilterOption } from '../widgets/inputs/FilterOptionModel';

export interface RosterHeaderStoreContract {
  selectedShift: number;
  setSelectedShift: (shift: number) => void;
  shiftOptions: FilterOption[];
  selectedLastName: string;
  setSelectedLastName: (e: any) => void;
  selectedQualificationOptions: FilterOption[];
  setSelectedQualificationOptions: (options: FilterOption[]) => void;
  qualificationOptions: FilterOption[];
  selectedCertificationOptions: FilterOption[];
  setSelectedCertificationOptions: (options: FilterOption[]) => void;
  certificationOptions: FilterOption[];
}

interface Props {
  rosterHeaderStore?: RosterHeaderStoreContract;
  className?: string;
}

@observer
export class RosterHeader extends React.Component<Props> {
  render() {
    const {className, rosterHeaderStore} = this.props;
    const {
      selectedShift,
      setSelectedShift,
      shiftOptions,
      selectedLastName,
      setSelectedLastName,
      selectedQualificationOptions,
      setSelectedQualificationOptions,
      qualificationOptions,
      selectedCertificationOptions,
      setSelectedCertificationOptions,
      certificationOptions,
    } = rosterHeaderStore!;
    return (
      <div className={classNames('thead', className)}>
        <span className="shift">
          <div className="header-column-title">SHIFT</div>
          <RosterLevelFilter
            id="shift-filter"
            unfilteredOptionLabel="All"
            value={selectedShift}
            callback={setSelectedShift}
            options={shiftOptions}
          />
        </span>
        <span>
          <div className={classNames("header-column-title", "name-header")}>NAME</div>
          <StyledTextInput
            value={selectedLastName}
            name="last-name"
            onChange={setSelectedLastName}
            placeholder="Search by Last Name"
            className="last-name-search"
          />
        </span>
        <span>
          <div className="header-column-title">QUALIFICATION</div>
          <StyledMultiTypeahead
            selected={selectedQualificationOptions}
            onChange={setSelectedQualificationOptions}
            options={qualificationOptions}
            placeholder="Filter Qualifications"
            className="qualifications-multitypeahead"
          />
        </span>
        <span>
          <div className="header-column-title">CERTIFICATION</div>
          <StyledMultiTypeahead
            selected={selectedCertificationOptions}
            onChange={setSelectedCertificationOptions}
            options={certificationOptions}
            placeholder="Filter Certifications"
            className="certifications-multitypeahead"
          />
        </span>
      </div>
    );
  }
}

export const StyledRosterHeader = inject('rosterHeaderStore')(styled(RosterHeader)`
  background-color: ${props => props.theme.lightest};
  border-left: 1px solid ${props => props.theme.graySteel};
  display: flex;
  vertical-align: center;
  
  .header-column-title {
    font-size: 0.875rem;
    font-weight: 500;  
  }
  
  & > span {
    padding: 0.5rem;
    width: 11.75rem;
      
    
    .header-column-title {
      margin-bottom: 1.125rem;
    }
    
    .name-header {
      margin-bottom: 1.1875rem;
    }
     
    .rbt-input {
      padding-bottom: 0.25rem;
    }
    
    & > input, select {
      padding: 0.5rem 0;
    }  
  }
  
  .shift {
   width: 6rem;
   .header-column-title {
      margin-bottom: 1.25rem;
    }
  }
`);