import * as React from 'react';
import * as classNames from 'classnames';
import styled from 'styled-components';
import { AirmanModel } from '../airman/models/AirmanModel';
import { observer } from 'mobx-react';
import { StyledPlannerEvent } from './PlannerEvent';
import { Moment } from 'moment';

interface Props {
  airman: AirmanModel;
  className?: string;
  plannerWeek: Moment[];
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
    const {airman, plannerWeek} = this.props;
    return plannerWeek.map((day, i) => {
      return <StyledPlannerEvent key={i} airman={airman} day={day}/>;
    });
  }
}

export const StyledPlanner = styled(Planner)`
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
`;
