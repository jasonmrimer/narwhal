import * as React from 'react';
import styled from 'styled-components';

interface Props {
  id?: string;
  value: string;
  onChange: (e: any) => void;
  name: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = (props: Props) => {
  return (
    <input
      id={props.id}
      disabled={props.disabled}
      className={props.className}
      type="date"
      value={props.value}
      name={props.name}
      onChange={props.onChange}
    />
  );
};

export const StyledDatePicker = styled(DatePicker)`
  background: none;
  color: ${props => props.theme.fontColor};
  border: none;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
  outline: inherit;
  //height: 1.25rem;
  
  &::-webkit-inner-spin-button {
    display: none;
  }
  
  &:disabled {
    cursor: initial;
    color: ${props => props.theme.graySteel};
  }
 
`;