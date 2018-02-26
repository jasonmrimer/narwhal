import * as React from 'react';
import styled from 'styled-components';
import * as classNames from 'classnames';

/* tslint:disable:no-any */
interface Props {
  options: string[];
  value: string;
  onChange: (e: any) => void;
  name?: string;
  className?: string;
}

export const RadioButtons = (props: Props) => {
  return (
    <div className={props.className}>
      {props.options.map(option => {
        const isChecked = props.value === option;
        return (
          <label key={option} className={classNames('input-wrapper', {checked: isChecked})}>
            <input
              type="radio"
              name={props.name}
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

export const StyledRadioButtons = styled(RadioButtons)`
  display: flex;
  flex-direction: column;
  
  input {
    visibility: hidden;
  }
  
  label.checked {
    color: ${props => props.theme.yellow};
    
    &:before{
      background: ${props => props.theme.graySteel};
    }
  }
  
  label {
    margin: 0.5rem 0rem;
    color: ${props => props.theme.fontColor};
    
    &:before {
      content: ' ';
      visibility: visible;
      border: 1px solid ${props => props.theme.graySteel};
      width: 1rem;
      height: 1rem;
      display: inline-block;
      border-radius: 50%;
      transition: all .25s ease-in-out;
      vertical-align: text-bottom;
    }
  }
`;