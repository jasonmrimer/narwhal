import * as React from 'react';
import styled from 'styled-components';
import { StyledRosterHeader } from './RosterHeader';
import { StyledPlannerHeader } from './PlannerHeader';
import { observer } from 'mobx-react';
import { StyledRoster } from './Roster';

interface Props {
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
          <StyledRosterHeader/>
          <StyledPlannerHeader/>
        </div>
        <StyledRoster/>
      </div>
    );
  }
}

export const StyledRosterContainer = styled(RosterContainer)`
  .roster-header {
    display: flex;
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }
 
`;