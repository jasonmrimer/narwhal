import * as React from 'react';
import DeleteIcon from '../icons/DeleteIcon';
import styled from 'styled-components';

interface Props {
  handleClick: (clickEvent: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const DeleteButton = (props: Props) => {
  return (
    <button type="button" className={`${props.className}`} onClick={props.handleClick}>
      <DeleteIcon/>
      <span>DELETE</span>
    </button>
  );
};

export default styled(DeleteButton)`
  display: flex;
  align-items: unset;
  width: fit-content;
  background: none;
  color: ${props => props.theme.fontColor};
  border: 1px solid ${props => props.theme.fontColor};
  padding: 0.5rem 1rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  cursor: pointer;
  outline: inherit;
  
  span {
    margin-left: 0.25rem;
  }
  
  &:hover {
    background: ${props => props.theme.fontColor};
    color: ${props => props.theme.darkest};
    
    svg > path {
      fill: ${props => props.theme.darkest};
    }
  }
`;