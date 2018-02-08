import * as React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  title: string;
  isActive: boolean;
  className?: string;
}

export const Tab: React.SFC<Props> = props => {
  return (
    <div className={props.className}>
      {props.isActive
        ? <ActiveBorder>{props.title}{props.children}</ActiveBorder>
        : <InactiveBorder onClick={props.onClick}>{props.title}{props.children}</InactiveBorder>
      }
    </div>
  );
};

export const ActiveBorder = styled.a`
  border-bottom: 3px solid ${props => props.theme.yellow};
`;

export const InactiveBorder = styled.a`
  border-bottom: 1px solid ${props => props.theme.graySteel};
`;

export default styled(Tab)`
  cursor: pointer;
  width: 100%;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
  }
`;