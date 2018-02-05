import * as React from 'react';
import styled from 'styled-components';
import * as classNames from 'classnames';

/* tslint:disable:no-any */
interface Props {
  options: string[];
  value: string;
  onChange: (e: any) => void;
  className?: string;
}

const RadioButtons = (props: Props) => {
  return (
    <div className={props.className}>
      {props.options.map(option => {
        const isChecked = props.value === option;
        return (
          <label key={option} className={classNames('input-wrapper', {checked: isChecked})}>
            <input
              type="radio"
              name="eventType"
              value={option}
              onChange={props.onChange}
              checked={isChecked}
            />
            {option}
          </label>
        );
      })}
    </div>
  );
};

export default styled(RadioButtons)`
  display: flex;
  flex-direction: column;
  
  
  input {
    visibility: hidden;
    margin: 0 1rem 0 0;

    &:before {
      content: ' ';
      visibility: visible;
      border: 1px solid ${props => props.theme.graySteel};
      width: 1rem;
      height: 1rem;
      display: inline-block;
      border-radius: 50%;
      transition: all .25s ease-in-out;
    }
  
    &:checked:before {
     background: ${props => props.theme.graySteel};
    }
  }
  
  label.checked {
    color: ${props => props.theme.yellow}
  }
  
  label {
    margin: 1rem 1rem 0rem 1rem;
    color: ${props => props.theme.fontColor};
  }
`;