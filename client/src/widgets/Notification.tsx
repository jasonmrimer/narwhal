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
  padding: 2.5rem 0;
  text-align: center;
  margin-top: 0;
`;

export const BorderedNotification = styled(Notification)`
  font-weight: 400;
  padding: 2.5rem 0;
  text-align: center;
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  margin-top: 0;
`;

export const EmptyBorderedNotification = styled(Notification)`
  font-weight: 400;
  padding: 2.5rem 0;
  text-align: center;
  border: 1px solid ${props => props.theme.graySteel};
  border-top: none;
  margin: 0;
`;