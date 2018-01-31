import * as React from 'react';
import styled from 'styled-components';
import * as classNames from 'classnames';

interface Props {
  dateValue: string;
  timeValue: string;
  /* tslint:disable:no-any*/
  onChange: (e: any) => void;
  name: string;
  className?: string;
}

export const DatePicker = (props: Props) => {
  return (
    <div className={classNames(props.className, 'date-time-row')}>
      <input
        type="date"
        value={props.dateValue}
        name={`${props.name}Date`}
        onChange={props.onChange}
      />
      <input
        className="time-input"
        type="text"
        placeholder="hh:mm"
        value={props.timeValue}
        name={`${props.name}Time`}
        onChange={props.onChange}
      />
    </div>
  );
};

export default styled(DatePicker)`  
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 1rem 0rem 1rem;
  &::-webkit-inner-spin-button {
    display: none;
  }
  
  .time-input::placeholder {
    color: ${props => props.theme.graySteel};
  }
  
  input {
    background: none;
    color: ${props => props.theme.graySteel};
    border: none;
    border-bottom: 1px solid green;
    border-bottom: 1px solid ${props => props.theme.graySteel};
    padding: 0;
    font: inherit;
    font-weight: 300;
    cursor: pointer;
    outline: inherit;
  }
  
`;