import * as React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
  onClick: (clickEvent: React.MouseEvent<HTMLButtonElement>) => void;
  renderIcon?: () => JSX.Element;
  className?: string;
}

export const Button = (props: Props) => {
  return (
    <button
      type="button"
      className={`${props.className}`}
      onClick={props.onClick}
    >
      {
        props.renderIcon &&
        <i>{props.renderIcon()}</i>
      }
      {props.text}
    </button>
  );
};

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  
  font: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  
  width: fit-content;
  
  background: none;
  
  color: ${props => props.theme.fontColor};
  
  border: 1px solid ${props => props.theme.fontColor};
  outline: inherit;
  
  padding: 0.5rem 1rem;
  
  cursor: pointer;
  
  letter-spacing: 1px;
  
  i {
    margin-right: 0.25rem;
  }
  
  &:hover {
    background: ${props => props.theme.fontColor};
    color: ${props => props.theme.darkest};
    text-decoration: underline;
    
    svg > path {
      fill: ${props => props.theme.darkest};
    }
  }
`;