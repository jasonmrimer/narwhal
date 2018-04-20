import * as React from 'react';
import { BackIcon } from '../icons/BackIcon';
import { NextIcon } from '../icons/NextIcon';
import { Moment } from 'moment';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { PlannerStore } from './stores/PlannerStore';
import { observer } from 'mobx-react';

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

export const PlannerHeader = observer((props: Props) => {
  return (
    <div className={classNames(props.className, 'planner-header')}>
      <div className="month-header">
        {props.plannerStore.plannerWeek[0].format('MMMM YYYY').toUpperCase()}
      </div>
      <span className="planner-day-navigation">
        <span className="button-header" onClick={async () => await props.plannerStore.decrementPlannerWeek()}>
          <button className="last-week" >
            <BackIcon height={14} width={14}/>
          </button>
        </span>

        {renderWeek(props.plannerStore.plannerWeek)}
        <span className="button-header" onClick={async () => await props.plannerStore.incrementPlannerWeek()}>
          <button className="next-week" >
            <NextIcon height={14} width={14}/>
          </button>
        </span>
      </span>
    </div>
  );
});

export const StyledPlannerHeader = styled(PlannerHeader)`
  background: ${props => props.theme.lightest};
  padding: 0.75rem;
  flex-grow: 2;
  border-left: 1px solid ${props => props.theme.graySteel};
  border-right: 1px solid ${props => props.theme.graySteel};
  
  .planner-day-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .next-week, .last-week {
    background: none;
    border: none;
   }
   
   .button-header{
    cursor: pointer;
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
    
    & > span {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 36px;
      
      div:first-child {
        font-size: 0.875rem;
        font-weight: 500; 
      }
     
      div:last-child {
        font-size: 0.625rem;
        font-weight: 300; 
      }
    }
  }
  
  .month-header {
    margin-bottom: 7px;
    font-size: 0.875rem;
    font-weight: 500;  
  }

`;