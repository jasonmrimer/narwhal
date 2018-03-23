import * as React from 'react';
import { RosterLevelFilter } from '../widgets/Filter';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import { RosterHeaderStore } from './stores/RosterHeaderStore';

interface Props {
  rosterHeaderStore: RosterHeaderStore;
  className?: string;
}

@observer
export class RosterHeader extends React.Component<Props> {
  render() {
    const {className, rosterHeaderStore} = this.props;
    return (
      <div className={classNames('thead', className)}>
        <span className="shift">
          <div>SHIFT</div>
          <RosterLevelFilter
            id="shift-filter"
            unfilteredOptionLabel="All"
            value={rosterHeaderStore.shiftFilter}
            callback={rosterHeaderStore.setShiftFilter}
            options={rosterHeaderStore.shiftOptions}
          />
        </span>
        <span>
          <div>NAME</div>
          <StyledTextInput
            value={rosterHeaderStore.lastNameFilter}
            name="last-name"
            onChange={rosterHeaderStore.setLastNameFilter}
            placeholder="Search by Last Name"
            className="last-name-search"
          />
        </span>
        <span>
          <div>QUALIFICATION</div>
          <StyledMultiTypeahead
            onChange={rosterHeaderStore.setQualificationIds}
            options={rosterHeaderStore.qualificationFilterOptions}
            placeholder="Filter Qualifications"
            className="qualifications-multiselect"
          />
        </span>
        <span>
          <div>CERTIFICATION</div>
          <StyledMultiTypeahead
            onChange={rosterHeaderStore.setCertificationIds}
            options={rosterHeaderStore.certificationOptions}
            placeholder="Filter Certifications"
            className="certifications-multiselect"
          />
        </span>
      </div>
    );
  }
}

export const StyledRosterHeader = styled(RosterHeader)`
  background-color: ${props => props.theme.lightest};
  border-left: 1px solid ${props => props.theme.graySteel};
  display: flex;
  flex-grow: 3;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  max-width: 868px;
  min-width: 837px;
  
  & > span {
    width: 23%;
    
    & > input, select {
      padding: 0.5rem 0;
    }  
  }
  
  .shift {
   width: 2rem;
  }
`;