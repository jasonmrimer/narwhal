import * as React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
  title: string;
  isActive: boolean;
  className?: string;
}

export const Tab = (props: Props) => {
  return (
    <div className={props.className}>
      {props.isActive
        ? <ActiveBorder>{props.title}</ActiveBorder>
        : <a onClick={props.onClick}>{props.title}</a>
      }
    </div>
  );
};

export const ActiveBorder = styled.a`
  border-bottom: 2px solid ${props => props.theme.yellow};
`;

export default styled(Tab)`
  padding: 1rem;
  padding-bottom: 0;
  cursor: pointer;
`;