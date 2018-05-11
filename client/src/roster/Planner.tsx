import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { AirmanModel } from '../airman/models/AirmanModel';
import { inject, observer } from 'mobx-react';
import { PlannerStore } from './stores/PlannerStore';
import { StyledPlannerEvent } from './PlannerEvent';

interface Props {
  airman: AirmanModel;
  plannerStore?: PlannerStore;
  className?: string;
}

@observer
export class Planner extends React.Component<Props> {
  render() {
    return (
      <div className={classNames(this.props.className, 'planner-row', 'tr')}>
        <span className="blank"/>
        <div>{this.renderEvents()}</div>
        <span className="blank"/>
      </div>
    );
  }

  private renderEvents = () => {
    const {airman, plannerStore} = this.props;
    return plannerStore!.plannerWeek.map((day, i) => {
      return <StyledPlannerEvent key={i} airman={airman} day={day}/>;
    });
  }
}

export const StyledPlanner =
  inject(
    'plannerStore'
  )(styled(Planner)`
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
