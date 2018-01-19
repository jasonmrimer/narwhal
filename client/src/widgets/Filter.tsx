import * as React from 'react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import FilterOption from './models/FilterOptionModel';
import { observer } from 'mobx-react/custom';

interface Props {
  id: string;
  label: string;
  unfilteredOptionLabel: string;
  value: number;
  options: FilterOption[];
  callback: (id: number) => void;
  className?: string;
}

const handleChange = (event: ChangeEvent<HTMLSelectElement>, {callback}: Props) => {
  callback(Number(event.target.value));
};

const renderOptions = (unfilteredOptionLabel: string, options: FilterOption[]) => {
  return [{value: -1, label: unfilteredOptionLabel}, ...options].map((opt, i) => {
    return <option key={i} value={opt.value}>{opt.label}</option>;
  });
};

export const Filter = observer((props: Props) => {
  const {options, value, unfilteredOptionLabel} = props;
  return (
    <div className={props.className}>
      <label htmlFor={props.id}>{props.label}</label>
      <br/>
      <select
        id={props.id}
        disabled={options.length === 0}
        value={value}
        onChange={(event) => handleChange(event, props)}
      >
        {renderOptions(unfilteredOptionLabel, options)}
      </select>
    </div>
  );
});

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
