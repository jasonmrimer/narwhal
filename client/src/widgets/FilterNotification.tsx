import * as React from 'react';
import styled from 'styled-components';

interface Props {
  children?: string;
  className?: string;
}

export const FilterNotification = (props: Props) => {
  return (
    <div className={props.className}>
      {props.children}
    </div>
  );
};

export const StyledFilterNotification = styled(FilterNotification)`
    position: fixed;
    transform: translateY(3.5rem);
    padding: 0.25rem;
    background: ${props => props.theme.yellow};
    color: ${props => props.theme.darkest};
    font-weight: 600;
`;