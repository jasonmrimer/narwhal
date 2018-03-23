import * as React from 'react';
import { StyledRosterBody } from './RosterBody';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import styled from 'styled-components';
import { StyledRosterHeader } from './RosterHeader';
import { StyledPlannerHeader } from './PlannerHeader';
import { observer } from 'mobx-react';

interface Props {
  trackerStore: TrackerStore;
  className?: string;
}

interface State {
  hoveredIndex: number;
}

@observer
export class RosterContainer extends React.Component<Props, State> {
  render() {
    return (
      <div className={this.props.className}>
        <div className="roster-header">
          <StyledRosterHeader rosterHeaderStore={this.props.trackerStore.rosterHeaderStore}/>
          <StyledPlannerHeader plannerStore={this.props.trackerStore.plannerStore}/>
        </div>
        <div className="roster-body">
          <StyledRosterBody
            trackerStore={this.props.trackerStore}
          />
        </div>
      </div>
    );
  }
}

export const StyledRosterContainer = styled(RosterContainer)`
  
  .roster-header, .roster-body {
    display: flex;
  }
  
  .roster-body {
    max-height: 900px;
    overflow: auto;
    border: 1px solid ${props => props.theme.graySteel};
    border-top: none;
  }
`;