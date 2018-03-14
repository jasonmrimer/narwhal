import * as React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  title: string;
  className?: string;
}

export const RipItemsTile = (props: Props) => {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
    >
      <div className="rip-item-tile-title">
        <span>{props.title}</span>
      </div>
      <div className="rip-item-tile-description"/>
    </div>
  );
};

export const StyledRipItemsTile = styled(RipItemsTile)`
  background: ${props => props.theme.blueSteel};
  border-radius: 0.25rem 0.25rem 0 0;
  margin: 0.5rem 0;
  padding: 1px;
  
  .rip-item-tile-title {
    padding: 0.35rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:hover {
      background-color: ${props => props.theme.hoverBlueSteel};
      border-radius: 0.25rem 0.25rem 0 0;
      cursor: pointer;
    }
  }

  .rip-item-tile-description {
    background: ${props => props.theme.lighter};
    font-size: 12px;
    padding: 0.35rem;
  }
`;
