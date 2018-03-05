import * as React from 'react';
import { BackIcon } from '../icons/BackIcon';
import { NextIcon } from '../icons/NextIcon';
import { Moment } from 'moment';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { PlannerStore } from '../roster/stores/PlannerStore';

interface Props {
  plannerStore: PlannerStore;
  className?: string;
}

const renderWeek = (plannerWeek: Moment[]) => {
  return (
    <div className="planner-day-header">
      {
        plannerWeek.map((day, index) =>
          <span key={index}>
            <div>{day.format('DD')}</div>
            <div>{day.format('ddd').toUpperCase()}</div>
          </span>
        )
      }
    </div>
  );
};

export const PlannerHeader = (props: Props) => {
  return (
    <th className={classNames(props.className, 'planner-header')}>
      <div className="month-header">
        {props.plannerStore.plannerWeek[0].format('MMMM YYYY').toUpperCase()}
      </div>
      <span className="planner-day-navigation">
        <span className="button-header">
          <button className="last-week" onClick={props.plannerStore.decrementPlannerWeek}>
            <BackIcon height={14} width={14}/>
          </button>
        </span>

        {renderWeek(props.plannerStore.plannerWeek)}
        <span className="button-header">
          <button className="next-week" onClick={props.plannerStore.incrementPlannerWeek}>
            <NextIcon height={14} width={14}/>
          </button>
        </span>
      </span>
    </th>
  );
};

export const StyledPlannerHeader = styled(PlannerHeader)`
  
  border-left: 1px solid ${props => props.theme.graySteel};
  
  .planner-day-navigation {;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .month-header {
    margin: 0 0 1rem 0;
  }

  .next-week, .last-week {
    background: none;
    border: none;
    padding: 0;
   }
   
  .last-week {
    padding-right: 1rem;
    cursor: pointer;
  }
  
  .next-week {
    padding-left: 1rem;
    cursor: pointer;
  }
   
  .planner-day-header {
    display: flex;
    justify-content: space-between;
    flex-grow: 2;
  }

`;