import * as React from 'react';
import { StyledTopBar } from '../TopBar';
import { StyledSiteManager } from '../../site-manager/SiteManager';

export const FlightsPage = () => {
  return (
    <React.Fragment>
      <StyledTopBar/>
      <StyledSiteManager />
    </React.Fragment>
  );
};