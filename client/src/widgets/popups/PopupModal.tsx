import * as React from 'react';
import styled from 'styled-components';
import { Button } from '../buttons/Button';
import { observer } from 'mobx-react';

interface Props {
  title: string;
  children: any;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

@observer
export class PopupModal extends React.Component<Props> {
  render() {
    return (
      <div className={this.props.className}>
        <div className="confirmation">
          <div className="title">
            <div>{this.props.title}</div>
            <span onClick={this.props.onCancel}>&#10006;</span>
          </div>
          {this.props.children}
          <div className="actions">
            <Button className="cancel" text="BACK" onClick={this.props.onCancel}/>
            <Button className="confirm" text="CONFIRM" onClick={this.props.onConfirm}/>
          </div>
        </div>
      </div>
    );
  }
}

export const StyledPopupModal = styled(PopupModal)`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  z-index: 1001;
  text-align: left;
  
  .title {
    padding: 0.5rem;
    background: ${props => props.theme.dark};
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    
    span {
      cursor: pointer;
    }
  }

  .confirmation {
    background: ${props => props.theme.blueSteel};
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2px;
  }
  
  & > span {
    padding: 1rem;
  }
    
  .actions {
      padding: 0.5rem;
      display: flex;    
      justify-content: flex-end;
      
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
      
       &.cancel {
        background: ${props => props.theme.yellow};
        color: ${props => props.theme.darkest};
        border: none;
      }
      
      &:hover {
        background: ${props => props.theme.fontColor};
        color: ${props => props.theme.darkest};
        text-decoration: underline;
        
        &.cancel{
          background: ${props => props.theme.yellowHover};
          color: ${props => props.theme.darkest};
        }
      }
    }
  }
`;