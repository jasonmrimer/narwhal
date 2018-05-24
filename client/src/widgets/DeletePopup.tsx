import * as React from 'react';
import styled from 'styled-components';
import { EventModel } from '../event/models/EventModel';
import { Skill } from '../skills/models/Skill';
import { AirmanCertificationModel } from '../airman/models/AirmanCertificationModel';
import { AirmanQualificationModel } from '../airman/models/AirmanQualificationModel';
import { AirmanModel } from '../airman/models/AirmanModel';
import { StyledPopupModal } from './PopupModal';

type Deletable = AirmanModel | EventModel | Skill;

interface Props {
  item: Deletable;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export const renderItemInformation = (item: Deletable) => {
  const format = 'DD MMM YY HH:mm';
  switch (item.constructor) {
    case EventModel:
      const event = item as EventModel;
      return `Remove ${event.title}, from ${event.startTime.format(format)} - ${event.endTime.format(format)}?`;
    case AirmanCertificationModel:
      return `Remove ${(item as AirmanCertificationModel).title}?`;
    case AirmanQualificationModel:
      return `Remove ${(item as AirmanQualificationModel).acronym}?`;
    case AirmanModel:
      return `Delete ${(item as AirmanModel).fullName}? This action cannot be undone.`;
    default:
      return 'REMOVE ITEM';
  }
};

export const renderTitle = (item: Deletable) => {
  switch (item.constructor) {
    case EventModel:
      return 'REMOVE EVENT';
    case AirmanCertificationModel:
      return 'REMOVE CERTIFICATION';
    case AirmanQualificationModel:
      return 'REMOVE QUALIFICATION';
    case AirmanModel:
      return 'DELETE MEMBER';
    default:
      return 'REMOVE ITEM';
  }
};

export class DeletePopup extends React.Component<Props> {
  render() {
    return (
      <StyledPopupModal
        title={renderTitle(this.props.item)}
        className={this.props.className}
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
      >
        <div className="content">
          <span>{renderItemInformation(this.props.item)}</span>
        </div>
      </StyledPopupModal>
    );
  }
}

export const StyledDeletePopup = styled(DeletePopup)`
`;
