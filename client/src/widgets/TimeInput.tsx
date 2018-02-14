import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-any*/
interface Props {
  timeValue: string;
  onChange: (e: any) => void;
  name: string;
  className?: string;
}

export const TimeInput = (props: Props) => {
  return (
    <input
      className={props.className}
      type="text"
      placeholder="hh:mm"
      value={props.timeValue}
      name={props.name}
      onChange={props.onChange}
    />

  );
};

export const StyledTimeInput = styled(TimeInput)`  
  &::placeholder {
    color: ${props => props.theme.graySteel};
  }
  
  background: none;
  color: ${props => props.theme.graySteel};
  border: none;
  border-bottom: 1px solid green;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
  outline: inherit;
  margin: 1rem 0;
`;