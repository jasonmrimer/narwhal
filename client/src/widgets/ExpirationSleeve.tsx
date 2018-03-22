import * as React from 'react';
import { ExpirationAlert } from '../icons/ExpirationAlert';
import styled, { withTheme } from 'styled-components';

interface Props {
  className?: string;
  theme?: any;
}

export const ExpirationSleeve = (props: Props) => {
  return (
    <span className={props.className}>
      <span className="border"/>
      <ExpirationAlert />
    </span>
  );
};

export const StyledExpirationSleeve = styled(withTheme(ExpirationSleeve))`
  display: flex;
  align-items: center;
  .border {
    width: 3rem;
    border-left: 32px solid transparent;
    border-bottom: 32px solid ${props => props.theme.yellow};
  }
  
  svg {
    border-top-right-radius: 3px;
    background: ${props => props.theme.yellow};
    height: 32px;
  }
`;