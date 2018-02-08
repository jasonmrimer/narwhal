import * as React from 'react';
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import FilterOption, { UnfilteredValue } from './models/FilterOptionModel';
import { observer } from 'mobx-react/custom';
import { caret } from '../utils/StyleUtils';

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
  return [{value: UnfilteredValue, label: unfilteredOptionLabel}, ...options].map((opt, i) => {
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

export const TopLevelFilter = styled(Filter)`
  min-width: 20%;
  display: inline-block;
  position: relative;
  float: left;
  z-index: 9;
  margin: 0 32px 0 0;
  

  &:after {
    content: ' ';
    background: ${props => caret(props.options.length === 0)};
    right: 0;
    height: 14px;
    width: 20px;
    top: 45px;
    position: absolute;
    pointer-events: none;
  }
  
  select::-ms-expand {
    display: none;
  }
  
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
    
    display: block;
    width: 100%;
    height: 50px;
    float: right;
    margin: 5px 0px;
    font-size: 16px;
    line-height: 1.75;
    border: none;
    border-bottom: 1px solid ${props => props.theme.fontColor};
    color: ${props => props.theme.fontColor};
    border-radius: 0;
    
    &:disabled {
      color: ${props => props.theme.graySteel};
      border-bottom: 1px solid ${props => props.theme.graySteel};
    }
  }
  
  option {
    color: black;
  }
`;
