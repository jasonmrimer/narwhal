import * as React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StyledTopBarTab } from './TopBarTab';

interface Props {
  username: string;
  className?: string;
}

interface State {
  isActive: LinkType;
}

export class TopBar extends React.Component<Props, State> {
  state = {isActive: LinkType.AVAILABILITY};

  render() {
    return (
      <div className={this.props.className}>
      <span>
        <img src="sally.png"/>
        <span>Narwhal</span>
      </span>
        <span className="navigation-tabs">
          <Link to={`/dashboard`} className="dashboard-link">
            <StyledTopBarTab
             onClick={() => this.onClick(LinkType.DASHBOARD)}
             title="MISSION"
             isActive={this.state.isActive === LinkType.DASHBOARD}
            />
          </Link>
          <Link to={`/`} className="availability-link">
            <StyledTopBarTab
              onClick={() => this.onClick(LinkType.AVAILABILITY)}
              title="AVAILABILITY"
              isActive={this.state.isActive === LinkType.AVAILABILITY}
            />
          </Link>
        </span>
        <span>
        {this.props.username}
      </span>
      </div>
    );
  }

  onClick = (linkType: LinkType) => {
    this.setState({isActive: linkType});
  }
}

export enum LinkType {
  DASHBOARD,
  AVAILABILITY
}

export const StyledTopBar = styled(TopBar)`
  border-collapse: collapse;
  
  background-color: ${props => props.theme.lighter};
  border-bottom: 2px solid ${props => props.theme.yellow};
  
  padding: 1rem 0;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  font-weight: 100;
  
  position: fixed;
  top: 3rem;
  
  width:100%;
  height: 2rem;
  
  z-index: 1000;
  
  img {
    height: 1.5rem;
    width: 1.5rem;
  }
  
  .navigation-tabs {
   display: flex;
   flex-direction: row;
   height: 100%;
   
    a {
      text-decoration: none;
    }
  }
  
  span:first-child {
    font-size: 1.25rem;
    margin-left: 1.5rem;
  }
  
  span:last-child {
    font-size: 0.75rem;
    margin-right: 1.5rem;
  }  
`;