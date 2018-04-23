import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react/custom';
import { ProfileSitePickerStore } from './stores/ProfileSitePickerStore';
import { inject } from 'mobx-react';

interface Props {
  profileStore?: ProfileSitePickerStore;
  className?: string;
}

export const SelectProfilePopup = observer(({profileStore, className}: Props) => {
  return (
    <div className={className}>
      <div className="site-confirmation">
        <div className="title">Site Selection</div>
        <div className="description">
          {profileStore!.pendingSite &&
          `This will set ${profileStore!.pendingSite!.fullName.toUpperCase()} as your home site.`
          }
          <br/> This cannot currently be undone.
      </div>
        <div className="pop-up-buttons">
          <button
            className="back"
            onClick={profileStore!.cancelPendingSite}
          >
            BACK
          </button>
          <button
            className="continue"
            onClick={profileStore!.savePendingSite}
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
});

export const StyledSelectProfilePopup = inject('profileStore')(styled(SelectProfilePopup)`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  z-index: 1001;
  
  .site-confirmation {
    text-align: left;
    background: ${props => props.theme.blueSteel};
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
    padding: 2px;
    
    .title {
     background: ${props => props.theme.dark};
     padding: 0.45rem;
     font-size: 1rem;
     border-top-left-radius: 2%;      
     border-top-right-radius: 2%;
     text-transform: uppercase;
    }
    
    .description {
      padding: 0.5rem 0.5rem 2rem 0.5rem;
    }
    
    .pop-up-buttons {
      display: flex;
      justify-content: flex-end;
      padding: 0 0.5rem;
    }
    
    button {
      font-size: 0.75rem;
      padding: 0.5rem 1.5rem;
      margin-left: 0.5rem;
      font-weight: 500;
      background: none;
      color: ${props => props.theme.fontColor};
      border: 1px solid ${props => props.theme.fontColor}; 
      border-radius: 5%;
      cursor: pointer;
      
      &.back {
        background: ${props => props.theme.yellow};
        color: ${props => props.theme.darkest};
        border: none;
      }
      
      &:hover {
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
        
        &.back{
          background: ${props => props.theme.yellowHover};
          color: ${props => props.theme.darkest};
        }
      }
    }
  }
`);