import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-any*/
interface Props {
  id?: string;
  dateValue: string;
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
      value={props.dateValue}
      name={props.name}
      onChange={props.onChange}
    />
  );
};

export default styled(DatePicker)`      
  background: none;
  color: ${props => props.theme.fontColor};
  border: none;
  border-bottom: 1px solid green;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
  outline: inherit;
  margin: 1rem 0;
  
  &::-webkit-inner-spin-button {
    display: none;
  }
  
  &:disabled {
    cursor: initial;
    color: ${props => props.theme.graySteel};
  }
 
`;