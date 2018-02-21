import * as React from 'react';
import styled from 'styled-components';

interface Props {
  username: string;
  pageTitle: string;
  className?: string;
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

export const StyledTopBar = styled(TopBar)`
  border-collapse: collapse;
  
  background-color: ${props => props.theme.lighter};
  
  box-shadow: ${props => props.theme.darkest} 0px 1px 4px;
  
  padding: 1rem 0;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  font-weight: 100;
  
  position: fixed;
  top: 3rem;
  
  width:100%;
  height: 2rem;
  
  z-index: 1000;
  
  span:first-child {
    font-size: 1.25rem;
    margin-left: 1.5rem;
  }
  
  span:last-child {
    font-size: 0.75rem;
    text-transform: uppercase;
    margin-right: 1.5rem;
  }  
`;