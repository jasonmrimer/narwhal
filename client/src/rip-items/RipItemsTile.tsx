import * as React from 'react';
import styled from 'styled-components';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';
import { observer } from 'mobx-react';

interface Props {
  onClick: () => void;
  title: string;
  hasExpiredRipItem: boolean;
  className?: string;
}

export const RipItemsTile = observer((props: Props) => {
  return (
    <div
      className={props.className}
      onClick={props.onClick}
    >
      <div className="rip-item-tile-title">
        <span>{props.title}</span>
        {props.hasExpiredRipItem &&
        <StyledExpirationSleeve/>
        }
      </div>
      <div className="rip-item-tile-description"/>
    </div>
  );
});

export const StyledRipItemsTile = styled(RipItemsTile)`
  background: ${props => props.theme.blueSteel};
  border-radius: 0.25rem 0.25rem 0 0;
  margin: 0.5rem 0;
  padding: 1px;
  
  .rip-item-tile-title {
    height: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0.375rem;
    
    &:hover {
      background-color: ${props => props.theme.hoverBlueSteel};
      border-radius: 0.25rem 0.25rem 0 0;
      cursor: pointer;
    }
  }

  .rip-item-tile-description {
   border-top: solid ${props => props.theme.blueSteel} 1px;
    background: ${props => props.theme.lighter};
    font-size: 0.75rem;
    padding: 0.35rem;
  }
`;
