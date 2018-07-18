import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { AirmanModel } from '../airman/models/AirmanModel';
import { inject, observer } from 'mobx-react';
import { StyledPlannerEvent } from './PlannerEvent';
import { Moment } from 'moment';
import { TabType } from '../tracker/stores/SidePanelStore';
import { SidePanelActions } from '../tracker/SidePanelActions';

interface Props {
  airman: AirmanModel;
  plannerWeek: Moment[];
  className?: string;
  sidePanelActions?: SidePanelActions;
}

@observer
export class Planner extends React.Component<Props> {
  render() {
    return (
      <div className={classNames(this.props.className, 'planner-row', 'tr')}>
        <div>{this.renderEvents()}</div>
      </div>
    );
  }

  private renderEvents = () => {
    const {airman, plannerWeek, sidePanelActions} = this.props;

    return plannerWeek.map((day, i) => {
      return (
        <nav
          key={i}
          onClick={async () => await sidePanelActions!.openSidePanel(airman, TabType.AVAILABILITY, day, true)}
        >
          <StyledPlannerEvent  airman={airman} day={day}/>
        </nav>);
    });

  }
}

export const StyledPlanner = inject('sidePanelActions')( styled(Planner)`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-grow: 2;
    }
    
    .blank {
      width: 30px;
    }
`);
