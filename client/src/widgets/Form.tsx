import * as React from 'react';
import styled from 'styled-components';

interface SubmitEvent {
  preventDefault: () => void;
}

interface FormProps {
  children: any;
  onSubmit: (event: SubmitEvent) => void;
  className?: string;
}

export const Form = (props: FormProps) => {
  return (
    <form className={props.className} onSubmit={props.onSubmit}>
      {props.children}
    </form>
  );
};

export const StyledForm = styled(Form)`
  text-align: left;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.graySteel};
`;

interface FormRowProps {
  children: JSX.Element | JSX.Element[] | (false | JSX.Element)[] | (null | JSX.Element)[];
  reversed?: boolean;
  direction?: string;
  className?: string;
}

export const FormRow = (props: FormRowProps) => {
  return (
    <div className={props.className}>
      {props.children}
    </div>
  );
};

export const StyledFormRow = styled(FormRow)`
  margin-top: 1rem;
  display: flex;
  flex-direction: ${props => props.reversed ? 'row-reverse' : props.direction || 'row'};
  align-items: baseline;
  justify-content: space-between;
  padding: 0.25rem 0;
`;