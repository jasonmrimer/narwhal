import * as React from 'react';
import { RosterLevelFilter } from '../widgets/Filter';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { observer } from 'mobx-react';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

@observer
export class RosterHeader extends React.Component<Props> {
  render() {
    return (
      <div className={classNames('thead', this.props.className)}>
        <span className="shift">
          <div>SHIFT</div>
          <RosterLevelFilter
            id="shift-filter"
            unfilteredOptionLabel="All"
            value={this.props.trackerStore.shiftFilter}
            callback={this.props.trackerStore.setShiftFilter}
            options={this.props.trackerStore.shiftOptions}
          />
        </span>
        <span>
          <div>NAME</div>
          <StyledTextInput
            value={this.props.trackerStore.lastNameFilter}
            name="last-name"
            onChange={this.props.trackerStore.setLastNameFilter}
            placeholder="Search by Last Name"
            className="last-name-search"
          />
        </span>
        <span>
          <div>QUALIFICATION</div>
          <StyledMultiTypeahead
            onChange={this.props.trackerStore.setQualificationIds}
            options={this.props.trackerStore.qualificationFilterOptions}
            placeholder="Filter Qualifications"
            className="qualifications-multiselect"
          />
        </span>
        <span>
          <div>CERTIFICATION</div>
          <StyledMultiTypeahead
            onChange={this.props.trackerStore.setCertificationIds}
            options={this.props.trackerStore.certificationOptions}
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