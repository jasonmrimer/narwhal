import * as React from 'react';
import { BackIcon } from '../icons/BackIcon';
import { NextIcon } from '../icons/NextIcon';
import { Moment } from 'moment';
import * as moment from 'moment';
import styled from 'styled-components';
import * as classNames from 'classnames';
import { PlannerStore } from './stores/PlannerStore';
import { inject, observer } from 'mobx-react';
import { TrackerStore } from '../tracker/stores/TrackerStore';
import { AvailabilityStore } from '../availability/stores/AvailabilityStore';
import { PlannerActions } from './PlannerActions';
import { StyledDatePicker } from '../widgets/inputs/DatePicker';
import { DatePickerIcon } from './DatePickerIcon';

interface Props {
  plannerStore?: PlannerStore;
  trackerStore?: TrackerStore;
  availabilityStore?: AvailabilityStore;
  plannerActions?: PlannerActions;
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

@observer
export class PlannerHeader extends React.Component<Props> {
  state = {calendarFocus: false};

  handleFocus = ({focused}: {focused: boolean}) => {
    this.setState({calendarFocus: focused});
  }

  handleDateChange = (event: any) => {
    this.props.plannerStore!.navigateToPlannerWeek(moment(event.target.value));
  }

  render() {
    const {plannerStore, plannerActions} = this.props;
    return (
      <div className={classNames(this.props.className, 'planner-header')}>
        <div
          onClick={() => {
            this.setState({calendarFocus: true});
          }}
          className="month-header"
        >
          <span>
            {plannerStore!.plannerWeek[0].format('MMMM YYYY').toUpperCase()}
          </span>
          <DatePickerIcon fill="#fff"/>
        </div>
        <StyledDatePicker
          value=""
          onChange={this.handleDateChange}
          id="planner-date-picker"
          name="date-picker"
          focused={this.state.calendarFocus}
          handleFocusChange={this.handleFocus}
        />
        <span className="planner-day-navigation">
        <span className="button-header">
          <button className="last-week" onClick={async () => await plannerActions!.decrementDay()}>
            <BackIcon height={14} width={14}/>
          </button>
        </span>
          {renderWeek(plannerStore!.plannerWeek)}
        <span className="button-header">
         <button className="next-week" onClick={async () => await plannerActions!.incrementDay()}>
            <NextIcon height={14} width={14}/>
          </button>
        </span>
      </span>
      </div>
    );
  }
}

export const StyledPlannerHeader = inject('plannerStore', 'trackerStore', 'plannerActions')(styled(PlannerHeader)`
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
    display: flex;
    
    &:hover {
      color: ${props => props.theme.purpleSteel};
      cursor: pointer;
      svg {
        fill: ${props => props.theme.purpleSteel};
      }
    }
    
    & > span {
      margin-right: 1rem;
    }
  }
  .DateInput.DateInput_1 {
    display: none;
  }
`);
