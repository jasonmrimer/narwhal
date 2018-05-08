import * as React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
}

export const Alert: React.SFC<Props> = (props) => {
  return (<h1 className={props.className}>{props.children}</h1>);
};

export const StyledAlert = styled(Alert)`
  background: ${props => props.theme.skySteel};
  width: 100%;
  font-size: 1rem;
  padding: 0.5rem 1rem;
`;