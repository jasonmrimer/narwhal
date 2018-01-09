import * as React from 'react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import FilterOptionModel from './models/FilterOptionModel';

interface Props {
  id: string;
  defaultOption: FilterOptionModel;
  options: FilterOptionModel[];
  callback: (option: FilterOptionModel) => void;
  className?: string;
  label: string;
}

const handleChange = (event: ChangeEvent<HTMLSelectElement>, {callback, defaultOption, options}: Props) => {
  const {value} = event.target;
  callback([defaultOption, ...options].find((opt) => opt.value === Number(value))!);
};

export const Filter = (props: Props) => {
  const options = [props.defaultOption, ...props.options].map((opt, i) => {
    return <option key={i} value={opt.value}>{opt.text}</option>;
  });

  return (
    <div className={props.className}>
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <select
        id={props.id}
        onChange={(event) => handleChange(event, props)}
      >
        {options}
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
    color: ${props => props.theme.blueSteel};
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
  }
`;
