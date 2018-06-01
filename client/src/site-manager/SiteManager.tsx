import * as React from 'react';
import { SiteManagerStore } from './stores/SiteManagerStore';
import { inject, observer } from 'mobx-react';
import { CellMeasurerCache } from 'react-virtualized';
import { Link } from 'react-router-dom';
import { OperatorIcon } from '../icons/OperatorIcon';
import styled from 'styled-components';
import { StyledCertificationList } from './CertificationList';
import { StyledFlightTables } from './FlightTables';
import { StyledButton } from '../widgets/buttons/Button';
import { StyledAddFlightPopup } from '../widgets/popups/AddFlightPopup';

interface Props {
  siteManagerStore?: SiteManagerStore;
  className?: string;
}

const cache = new CellMeasurerCache({
  defaultHeight: 60,
  fixedWidth: true
});

@observer
export class SiteManager extends React.Component<Props> {

  render() {
    const {siteManagerStore} = this.props;
    const squadron = this.props.siteManagerStore!.squadron;
    cache.clearAll();
    return (
      <div className={this.props.className}>
        {
          siteManagerStore!.pendingNewFlight &&
          <StyledAddFlightPopup/>
        }
        <div className="header">
          <h2>{siteManagerStore!.siteName} Personnel</h2>
          <Link to="/flights/new">
            <OperatorIcon/>
            <span>New Operator</span>
          </Link>
        </div>
        {
          squadron &&
          <StyledFlightTables flights={squadron.flights}/>
        }
        <div>
          <StyledButton
            text="Add Flight"
            onClick={siteManagerStore!.addFlight}
          />
        </div>
        <h2 className="certification-section-header">
          {siteManagerStore!.siteName} has {siteManagerStore!.certifications.length} certifications.
        </h2>
        <StyledCertificationList certifications={siteManagerStore!.certifications}/>
      </div>
    );
  }
}

export const StyledSiteManager = inject('siteManagerStore')(styled(SiteManager)`
  width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 300;
    padding-top: 0.5rem;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    a {
      width: 15%;
      display: flex;
      justify-content: space-between;
    }
  }
  
  a {
    text-decoration: none;
    color: ${props => props.theme.fontColor};
  }
`);
