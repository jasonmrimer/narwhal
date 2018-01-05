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
    <select
      id={props.id}
      className={props.className}
      onChange={(event) => handleChange(event, props)}
    >
      {options}
    </select>
  );
};

const caret = (fillColor: string) => {
  return `url("data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='${fillColor}'>
        <polygon points='0,0 100,0 50,50'/>
    </svg>")
    no-repeat center right`;
};

export default styled(Filter)`
    background-color: ${props => props.theme.dark};
    background: ${props => caret(props.theme.fontColor)};
    background-position: 98%;
    background-size: 0.75rem;
    color: ${props => props.theme.fontColor};
    min-width: 20%;
    height: 2rem;
    border: none;
    font-size: 1rem;
    border-bottom: 1px solid ${props => props.theme.fontColor};
    -webkit-appearance: none;
    -webkit-border-radius: 0;
`;