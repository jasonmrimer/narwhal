import * as React from 'react';
import styled from 'styled-components';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { observer } from 'mobx-react';
import { SiteModel } from '../site/models/SiteModel';
import * as classNames from 'classnames';
import { StyledSelectProfilePopup } from './SelectProfilePopup';

interface Props {
  profileStore: ProfileSitePickerStore;
  className?: string;
}

@observer
export class ProfileSitePicker extends React.Component<Props> {
  handleChange = (selectedSite: SiteModel) => {
    this.props.profileStore.setPendingSite(selectedSite);
    // await this.props.profileStore.saveSiteId(Number(event.target.value));
  }

  renderButtons(sites: SiteModel[]) {
    return sites.map((site) => {
      return (
        <button
          onClick={() => this.handleChange(site)}
          key={site.id}
        >
          {site.fullName}
        </button>
      );
    });
  }

  render() {
    const {profileStore, className} = this.props;
    const {dgsCoreSites, dmsSites, guardSites} = profileStore;
    return (
      <div className={className}>
        <h2>SELECT YOUR HOME SITE</h2>
        <div>This will grant you edit permissions for the site and set it as your home page.</div>
        <div className="buttons">
          <div className={classNames('column', 'dgs-core-sites')}>
            <h3>DGS CORE SITES</h3>
            {this.renderButtons(dgsCoreSites)}
          </div>
          <div className={classNames('column', 'dms-sites')}>
            <h3>DMS SITES</h3>
            {this.renderButtons(dmsSites)}
          </div>
          <div className={classNames('column', 'guard-sites')}>
            <h3>GUARD SITES</h3>
            {this.renderButtons(guardSites)}
          </div>
        </div>
        {
          profileStore.pendingSite &&
            <StyledSelectProfilePopup
              selectedSite={profileStore.pendingSite}
              backFromPendingSiteSelection={profileStore.cancelPendingSite}
              continuePendingSiteSelection={profileStore.savePendingSite}
            />
        }
      </div>
    );
  }
}

export const StyledProfileSitePicker = styled(ProfileSitePicker)`
  min-width: 1000px;
  margin: 0 auto;
  text-align: center;
  
  h2, h3 {
    font-size: 1.5rem;
    font-weight: 300;
  }
  
  h3 {
    margin: 2.5rem 0 2rem 0;
    text-align: left;
  }
  
  .buttons {
   display: flex;
   flex-direction: row;
   justify-content: center;
  }  

  .column {
    display: flex;
    flex-direction: column;
    margin: 0 2rem;
    width: 15rem;
  }
  
  button {
    padding: 1rem 0.5rem;
    margin-bottom: 1rem;
    text-align: left;
    text-transform: uppercase;
    color: ${props => props.theme.fontColor};
    border: none;
    cursor: pointer;
  }

  .dgs-core-sites {
    button {
      background: ${props => props.theme.skySteel};
      
      &:hover {
        background: ${props => props.theme.graySteel};
      }
    }    
  }

  .dms-sites {
    button {
      background: ${props => props.theme.blueSteel};
    
      &:hover {
        background: ${props => props.theme.graySteel};
      }    
    }    
  }

  .guard-sites {
    button {
      background: ${props => props.theme.tealSteel};
       
      &:hover {
        background: ${props => props.theme.graySteel};
      }    
    }    
  }
`;