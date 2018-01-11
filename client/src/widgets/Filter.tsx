import * as React from 'react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import FilterOption from './models/FilterOptionModel';

interface Props {
  id: string;
  label: string;
  value: number;
  unfilteredOption: FilterOption;
  options: FilterOption[];
  callback: (option: FilterOption) => void;
  className?: string;
  disabled?: boolean;
}

const handleChange = (event: ChangeEvent<HTMLSelectElement>, {callback, unfilteredOption, options}: Props) => {
  const {value} = event.target;
  callback([unfilteredOption, ...options].find((opt) => opt.value === Number(value))!);
};

export const Filter = (props: Props) => {
  const options = props.disabled ? [] : [props.unfilteredOption, ...props.options];
  return (
    <div className={props.className}>
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <select
        id={props.id}
        disabled={!!props.disabled}
        value={props.value}
        onChange={(event) => handleChange(event, props)}
      >
        {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
};

const caret = (fillColor: string) => {
  return `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='${fillColor}'>
        <polygon points='0,0 100,0 50,50'/>
    </svg>")
    no-repeat center right`;
};

export const TopLevelFilter = styled(Filter)`
  min-width: 20%;
  display: inline-block;
  
  label {
    font-weight: 500;
    font-size: .75rem;
    color: ${props => props.theme.darkSteel};
  }
  
  select {
    background-color: ${props => props.theme.dark};
    background: ${props => caret(props.theme.fontColor)};
    background-position: 98%;
    background-size: 0.75rem;
    color: ${props => props.theme.fontColor};
    height: 2rem;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid ${props => props.theme.fontColor};
    -webkit-appearance: none;
    -webkit-border-radius: 0;
    min-width: 50%;
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      border-bottom-color: ${props => props.theme.graySteel};
      background: ${props => caret(props.theme.graySteel)};
      background-position: 98%;
      background-size: 0.75rem;
    }
  }
`;
