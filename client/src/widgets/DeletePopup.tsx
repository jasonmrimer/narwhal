import * as React from 'react';
import styled from 'styled-components';
import { EventModel } from '../event/models/EventModel';
import { Skill } from '../skills/models/Skill';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import { StyledButton } from './Button';

interface Props {
  item: EventModel | Skill;
  onConfirm: () => void;
  onCancel: (item: EventModel | Skill | null) => void;
  className?: string;
}

export const renderItemInformation = (item: EventModel | Skill) => {
  const format = 'DD MMM YY HH:mm';
  switch (item.constructor) {
    case EventModel:
      const event = item as EventModel;
      return `Remove ${event.title}, from ${event.startTime.format(format)} - ${event.endTime.format(format)}?`;
    case AirmanCertificationModel:
      return `Remove ${(item as AirmanCertificationModel).title}?`;
    case AirmanQualificationModel:
      return `Remove ${(item as AirmanQualificationModel).acronym}?`;
    default:
      return 'REMOVE ITEM';
  }
};

export const renderTitle = (item: EventModel | Skill) => {
  switch (item.constructor) {
    case EventModel:
      return 'REMOVE EVENT';
    case AirmanCertificationModel:
      return 'REMOVE CERTIFICATION';
    case AirmanQualificationModel:
      return 'REMOVE QUALIFICATION';
    default:
      return 'REMOVE ITEM';
  }
}

export const DeletePopup = (props: Props) => {
  return (
    <div className={props.className}>
      <div className="delete-confirmation">
        <div className="title">{renderTitle(props.item)}</div>
        <span>{renderItemInformation(props.item)}</span>
        <span className="actions">
          <StyledButton className="cancel" onClick={(e) => props.onCancel(null)} text="CANCEL"/>
          <StyledButton className="confirm" onClick={(e) => props.onConfirm()} text="REMOVE"/>
        </span>
      </div>
    </div>
  );
};

export const StyledDeletePopup = styled(DeletePopup)`
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-size: 1rem;
  z-index: 1001;
  text-align: left;
  
  .delete-confirmation {
    background: ${props => props.theme.blueSteel};
    width: 500px;
    display: flex;
    flex-direction: column;
    position: relative; 
    top: 50%; 
    left: 50%; 
    transform: translate(-50%, -50%);
    padding: 2px;
    
    & > div {
      background: ${props => props.theme.dark};
      padding: 0.45rem;
      font-size: 1rem;
      border-top-left-radius: 2%;      
      border-top-right-radius: 2%;      
    }
    
    & > span {
      padding: 1rem;
    }
    
    .actions {
      padding: 1rem;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
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
