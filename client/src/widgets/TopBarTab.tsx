import * as React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  title: string;
  isActive: boolean;
  className?: string;
}

export const TopBarTab = (props: Props) => {
  return (
    <div className={props.className}>
      {props.isActive
        ? <ActiveBorder>{props.title}</ActiveBorder>
        : <InactiveBorder onClick={props.onClick}>{props.title}</InactiveBorder>
      }
    </div>
  );
};

export const ActiveBorder = styled.div`
  border-bottom: 2px solid ${props => props.theme.dark};
  border-top: 2px solid ${props => props.theme.yellow};
  border-left: 2px solid ${props => props.theme.yellow};
  border-right: 2px solid ${props => props.theme.yellow};
  background-color: ${props => props.theme.dark};
  border-radius: 0.25rem 0.25rem 0 0;  
  color: ${props => props.theme.yellow};
`;

export const InactiveBorder = styled.div`
  border-bottom: none;
`;

export const StyledTopBarTab = styled(TopBarTab)`
  color: ${props => props.theme.fontColor};
  cursor: pointer;
  width: 12rem;
  
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1rem 0.6875rem 1rem;
  }
`;