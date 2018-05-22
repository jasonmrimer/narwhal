import * as React from 'react';
import styled from 'styled-components';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { inject, observer } from 'mobx-react';
import { SiteModel } from '../site/models/SiteModel';
import * as classNames from 'classnames';
import { StyledSelectProfilePopup } from './SelectProfilePopup';
import { StyledSquadronButton } from './SquadronButton';

interface Props {
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

@observer
export class ProfileSitePicker extends React.Component<Props> {
  handleSelect = (selectedSite: SiteModel) => {
    this.props.profileStore!.setPendingSquadron(null);
    this.props.profileStore!.setPendingSite(selectedSite);
  };

  renderSquadrons = (site: SiteModel) => {
    const {pendingSite} = this.props.profileStore!;

    if (!pendingSite) {
      return null;
    }

    return site.id === pendingSite.id ?
      site.squadrons.map(squadron => {
        return <StyledSquadronButton key={squadron.id} squadron={squadron}/>;
      }) : null;
  };

  renderButtons = (sites: SiteModel[]) => {
    const {pendingSite} = this.props.profileStore!;
    return sites.map((site) => {
      return (
        <div key={site.id}>
          <button
            onClick={() => this.handleSelect(site)}
            className={classNames({
              'is-selected': pendingSite && site.id === pendingSite.id,
              'is-grayed': pendingSite && site.id !== pendingSite.id
            })}
          >
            {site.fullName}
          </button>
          {this.renderSquadrons(site)}
        </div>
      );
    });
  };

  renderConfirmationPopup = () => {
    const {pendingSquadron, pendingSite} = this.props.profileStore!;

    if (!pendingSite) {
      return null;
    }

    if (pendingSquadron || !pendingSite.hasSquadrons) {
      return <StyledSelectProfilePopup/>;
    }

    return null;
  };

  render() {
    const {profileStore, className} = this.props;
    return (
      <div className={className}>
        <h2>SELECT YOUR HOME SITE</h2>
        <div>This will grant you edit permissions for the site and set it as your home page.</div>
        <div className="buttons">
          <div className={classNames('column', 'dgs-core-sites')}>
            <h3>DGS CORE SITES</h3>
            {this.renderButtons(profileStore!.dgsCoreSites)}
          </div>
          <div className={classNames('column', 'dms-sites')}>
            <h3>DMS SITES</h3>
            {this.renderButtons(profileStore!.dmsSites)}
          </div>
          <div className={classNames('column', 'guard-sites')}>
            <h3>GUARD SITES</h3>
            {this.renderButtons(profileStore!.guardSites)}
          </div>
        </div>
        {this.renderConfirmationPopup()}
      </div>
    );
  }
}

export const StyledProfileSitePicker = inject('profileStore')(styled(ProfileSitePicker)`
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
    width: 100%;
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
  
  .dgs-core-sites, .dms-sites, .guard-sites {
    button.is-selected {
      background: ${props => props.theme.yellow};
    }
    button.is-grayed {
      opacity: 0.5;
    }
  }
`);