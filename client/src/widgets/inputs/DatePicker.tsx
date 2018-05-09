import * as React from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import styled from 'styled-components';
import * as moment from 'moment';
import { Moment } from 'moment';
import { randomText } from '../../utils/randomizer';

interface Props {
  id?: string;
  value: string;
  onChange: (e: any) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  focused?: boolean;
  handleFocusChange?: any;
}

interface State {
  focused: boolean | null;
}

export class DatePicker extends React.Component<Props, State> {
  state = {focused: false};

  onChange = (date: Moment | null) => {
    if (date == null) {
      this.props.onChange({target: {name: this.props.name, value: ''}});
    } else {
      this.props.onChange({target: {name: this.props.name, value: date.startOf('day').toISOString()}});
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <SingleDatePicker
          id={this.props.id || `date-picker-${randomText(10)}`}
          date={this.props.value !== '' ? moment(this.props.value) : null}
          onDateChange={this.onChange}
          focused={this.props.focused || this.state.focused || false}
          onFocusChange={this.props.handleFocusChange ?
            this.props.handleFocusChange :
            ({focused}) => this.setState({focused})
          }
          disabled={this.props.disabled}
          numberOfMonths={1}
          showClearDate={!this.props.disabled}
          hideKeyboardShortcutsPanel={true}
          isOutsideRange={() => false}
          placeholder="MM/DD/YYYY"
        />
      </div>
    );
  }
}

export const StyledDatePicker = styled(DatePicker)`
  .DateInput_fangShape {
    fill: ${props => props.theme.light};
  }
  
   .DateInput_fangStroke {
    stroke: ${props => props.theme.light};
   }

   // buttons
  .DayPickerNavigation_button {
    background-color: ${props => props.theme.light};
    border: 1px solid ${props => props.theme.graySteel};
    
    &:hover {
      background-color: ${props => props.theme.light};
      border: 1px solid ${props => props.theme.yellowHover};
      
      & > svg {
        fill: ${props => props.theme.yellow};
      }
    }
    
    &:active {
      background-color: ${props => props.theme.yellow};
      border: 1px solid ${props => props.theme.yellowHover};
      
      & > svg {
        fill: ${props => props.theme.darkest};
      }
    }
  }
  
  .DayPickerNavigation_button > svg {
    fill: ${props => props.theme.fontColor};
  }

  .CalendarMonth {
    background-color: ${props => props.theme.light};
  }
  
  .CalendarMonth_caption {
    color: ${props => props.theme.fontColor};
    font-family: ${props => props.theme.fontFamily};
    
    & > strong {
      font-weight: ${props => props.theme.fontWeight} !important;
    }
  }
  
  .CalendarMonthGrid {
    background-color: ${props => props.theme.light};
  }
  
  .CalendarDay {
    background-color: ${props => props.theme.light};
    color: ${props => props.theme.fontColor};
    border: 1px solid ${props => props.theme.graySteel};
    
    &:hover {
      background-color: ${props => props.theme.light};
      color: ${props => props.theme.yellow};
      border: 1px double ${props => props.theme.yellowHover};
    }
    
    &:active {
      background-color: ${props => props.theme.yellow};
      color: ${props => props.theme.darkest};
      border: 1px double ${props => props.theme.yellowHover};
    }
  }
  
  .CalendarDay__selected {
    background-color: ${props => props.theme.yellow};
    color: ${props => props.theme.darkest};
    border: 1px double ${props => props.theme.yellowHover};
  }
  
  .DayPicker > div {
    background-color: ${props => props.theme.light};
  }
  
  .DayPicker_weekHeader {
    color: ${props => props.theme.fontColor};
  } 
  
  .SingleDatePickerInput, .DateInput_input {
    background-color: ${props => props.theme.lighter};
    border: none;
  }
  
  .DateInput {
    background: none; 
  }
  
  .DateInput_fang {
    top: 20px !important;
    left: 0px !important;
  }
  
  .SingleDatePicker_picker {
    top: 30px !important;
  }
  
  .DateInput_input {
    color: ${props => props.theme.fontColor};
    border-bottom: 1px solid ${props => props.theme.graySteel};
    padding: 0;
    font-size: 1rem;
    line-height: initial;
    cursor: pointer;
    
    &::placeholder {
      color: ${props => props.theme.graySteel};
    }
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      cursor: initial;
      border: none;
    }
  }
  
  .SingleDatePickerInput__showClearDate {
    padding: 0;
  }
  
  .SingleDatePickerInput_clearDate {
    margin: 0;
    top: 44%;
    right: -9%;
    
    & > svg {
      fill: ${props => props.theme.fontColor};
      height: 10px;
    }
    
    &:hover, &:focus {
      background: none;
    }
  }
`;