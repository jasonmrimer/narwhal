import * as React from 'react';
import styled from 'styled-components';

/* tslint:disable:no-any */
interface Props {
  placeholder: string;
  value: string;
  name: string;
  onChange: (e: any) => void;
  className?: string;
  disabled?: boolean;
}

export const TextInput = (props: Props) => {
  return (
    <input
      className={props.className}
      type="text"
      placeholder={props.placeholder}
      value={props.value}
      name={props.name}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};

export const StyledTextInput = styled(TextInput)`
  &::placeholder {
   color: ${props => props.theme.graySteel};
  }
  
  background: none;
  color: ${props => props.theme.fontColor};
  border: none;
  border-bottom: 1px solid ${props => props.theme.graySteel};
  padding: 0;
  font: inherit;
  font-weight: 300;
  cursor: pointer;
  outline: inherit;
  height: 1.25rem;
  width: 100%;
`;
