import * as React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
}

export const Notification: React.SFC<Props> = (props) => {
  return (
    <h3 className={props.className}>{props.children}</h3>
  );
};

export const StyledNotification = styled(Notification)`
  font-weight: 400;
  margin: 2.5rem 0;
  text-align: center;
`;