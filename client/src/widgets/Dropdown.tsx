import * as React from 'react';
import styled from 'styled-components';
import { FilterOption } from './models/FilterOptionModel';
import { caret } from '../utils/StyleUtils';

interface Props {
  name: string;
  options: FilterOption[];
  value: any;
  onChange: (event: object) => void;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown = (props: Props) => {
  return (
    <select
      id={props.id}
      name={props.name}
      className={props.className}
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange}
    >
      {
        props.options.map((opt, index) => {
          return (<option key={index} value={opt.value}>{opt.label}</option>);
        })
      }
    </select>
  );
};

export const StyledDropdown = styled(Dropdown)`
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
  width: 75%;
  
  &:disabled {
    color: ${props => props.theme.graySteel};
    background: none;
    border-bottom: 1px solid ${props => props.theme.graySteel};
  }
`;