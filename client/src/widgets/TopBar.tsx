import * as React from 'react';
import styled from 'styled-components';

interface Props {
  username: string;
  className?: string;
  pageTitle: string;
}

export const TopBar = (props: Props) => {
  return (
    <div className={props.className}>
      <span>
        {props.pageTitle}
      </span>
      <span>
        {props.username}
      </span>
    </div>
  );
};

export default styled(TopBar)`
  border-collapse: collapse;
  background-color: ${props => props.theme.lighter};
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 100;
  box-shadow: ${props => props.theme.darkest} 0px 1px 4px;
  
  span:first-child {
    font-size: 1.25rem;
  }
  
  span:last-child {
    font-size: 0.75rem;
    text-transform: uppercase;
  }  
`;