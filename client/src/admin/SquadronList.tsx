import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AdminSquadronStore } from './stores/AdminSquadronStore';
import { AdminSquadronActions } from './actions/AdminSquadronActions';
import { AddIcon } from '../icons/AddIcon';
import { CloseIcon } from '../icons/CloseIcon';

interface Props {
  adminSquadronActions?: AdminSquadronActions;
  adminSquadronStore?: AdminSquadronStore;
  className?: string;
}

@observer
export class SquadronList extends React.Component<Props> {
  render() {
    const {adminSquadronActions, adminSquadronStore, className} = this.props;

    const {
      hasData
      , squadrons
    } = adminSquadronStore!;

    return (
      <React.Fragment>
        {hasData &&
        <div className={className}>
          <div className="title">
            <span className="squadron-title">All Sites/Squadrons</span>
            <span
              className="add-squadron-button"
              onClick={async () => {
                await adminSquadronStore!.performLoading(adminSquadronActions!.showAddSquadron);
              }}
            >
              <AddIcon/> Add Squadron
            </span>
          </div>
          {squadrons.map(parent => {
            return (<React.Fragment key={parent.parent.siteId!}>
              <div className="sub-header">
                {parent.parent.siteName}
              </div>
              {
                parent.children.map((squadron) => {
                  return (
                    <div key={squadron.squadronId!} className="row">
                      <span className="cell">{squadron.squadronName}</span>
                      {adminSquadronActions!.showDeleteForSquadron(squadron) &&
                      <span
                        className="row-button"
                      >
                        <div
                          className="icon"
                          onClick={() => adminSquadronStore!.setPendingDeleteSquadron(squadron)}
                        >
                          <CloseIcon/>
                        </div>
                      </span>}
                    </div>
                  );
                })
              }
            </React.Fragment>);
          })}
        </div>}
      </React.Fragment>
    );
  }
}

export const StyledSquadronList = inject(
  'adminSquadronActions',
  'adminSquadronStore'
)(styled(SquadronList)`
    display: inline-block;
    float: left;
    height: 32rem;
    width: 32rem;
    margin-left: 10rem;
    border: 1px solid ${props => props.theme.graySteel};
    overflow: auto;
    
    .row {
      padding: 1rem 1rem 1rem 2rem;
    }
    
    .sub-header {
      padding: 1rem;
    }
    
    .row, .sub-header {
      display:flex;
      
      & > .cell {
        width: 33%;
        display: flex;
       }
    }
    
    .title, .sub-header {
      font-weight: 500;
    }
    
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      margin: 0;
      background: ${props => props.theme.lightest};
    
      .squadron-title, .add-squadron-button {
        display: flex;
        align-items: center;
        width: 33%;
      }
      
      .add-squadron-button {
        font-size: 0.75rem;
        justify-content: flex-end;
        cursor: pointer;

        & > .icon {
          margin-right: 0.5rem;
        }
      }
    }
    
    .row-button {
        width: 66%;
        display: flex;
        justify-content: flex-end;
        cursor: pointer;
        
        & > .icon {
          margin-right: 0.5rem;
        }
      }
    
    .row {
      &:nth-child(odd) {
        background: ${props => props.theme.dark};
      }
  
      &:nth-child(even) {
        background: ${props => props.theme.light};
      }
    }
    
    .header {
      background-color: ${props => props.theme.lightest};
    }
    
    .sub-header {
      background-color: ${props => props.theme.skySteel};
    }
`);