import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { StyledDashboard } from '../../dashboard/Dashboard';
import { observer } from 'mobx-react';

export const DashboardPage = (observer(() => {
  return (
    <React.Fragment>
      <StyledTopBar/>
      <StyledDashboard/>
    </React.Fragment>
  );
}));