import * as React from 'react';
import {ChangeEvent} from 'react';
import FilterOption from './models/FilterOption';
import styled from 'styled-components';

interface Props {
  options: FilterOption[];
  callback: (option: FilterOption) => void;
  className?: string;
}

const handleChange = (event: ChangeEvent<HTMLSelectElement>, {callback, options}: Props) => {
  const {value} = event.target;
  callback(options.find((opt) => opt.value === Number(value))!);
};

export const Filter = (props: Props) => {
  const options = props.options.map((opt, i) => <option key={i} value={opt.value}>{opt.text}</option>);
  return (
    <select onChange={(event) => handleChange(event, props)} className={props.className}>
      {options}
    </select>
  );
};


export default styled(Filter)`
    background-color: ${props => props.theme.dark};
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='50' fill='${props => props.theme.fontColor}'><polygon points='0,0 100,0 50,50'/></svg>") no-repeat center right;
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