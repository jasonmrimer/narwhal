import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { AdminSquadronStore } from './stores/AdminSquadronStore';

interface Props {
  adminSquadronStore?: AdminSquadronStore;
  className?: string;
}

@observer
export class SquadronList extends React.Component<Props> {
  render() {
    const {className, adminSquadronStore} = this.props;
    const {
      hasData
      , squadrons
    } = adminSquadronStore!;

    return (
      <React.Fragment>
        {hasData &&
        <div className={className}>
          <div className="header">
            <span>All Squadrons</span>
          </div>
          <div className="sub-header">
            SITE/SQUADRON
          </div>
          {squadrons.map((squadron) => {
            return (
              <div key={squadron.squadronId} className="row">
                <span>{squadron.siteName}/{squadron.squadronName}</span>
              </div>
            );
          })}
        </div>}
      </React.Fragment>
    );
  }
}

export const StyledSquadronList = inject('adminSquadronStore')(styled(SquadronList)`
    display: inline-block;
    float: left;
    width: 500px;
    margin-left: 10rem;
    border: 1px solid ${props => props.theme.graySteel};
    overflow: auto;
    height: 500px;
    
    .row, .header, .sub-header {
      padding: 1rem;
      
      & > span {
        width: 33%;
        display: inline-block;
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