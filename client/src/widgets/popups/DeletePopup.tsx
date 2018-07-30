import * as React from 'react';
import styled from 'styled-components';
import { EventModel } from '../../event/models/EventModel';
import { Skill } from '../../skills/models/Skill';
import { AirmanCertificationModel } from '../../airman/models/AirmanCertificationModel';
import { AirmanQualificationModel } from '../../airman/models/AirmanQualificationModel';
import { AirmanModel } from '../../airman/models/AirmanModel';
import { StyledPopupModal } from './PopupModal';
import { AdminSquadronModel } from '../../admin/models/AdminSquadronModel';

type Deletable = AirmanModel | EventModel | Skill | AdminSquadronModel;

interface Props {
  item: Deletable;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  className?: string;
}

export const renderItemInformation = (item: Deletable) => {
  const format = 'DD MMM YY HH:mm';
  switch (item.constructor) {
    case AdminSquadronModel:
      const model = item as AdminSquadronModel;
      return `Are you sure you want to delete '${model.siteName}/${model.squadronName}'?`;
    case AirmanCertificationModel:
      return `Remove ${(item as AirmanCertificationModel).title}?`;
    case AirmanModel:
      return `Delete ${(item as AirmanModel).fullName}? This action cannot be undone.`;
    case AirmanQualificationModel:
      return `Remove ${(item as AirmanQualificationModel).acronym}?`;
    case EventModel:
      const event = item as EventModel;
      return `Remove ${event.title}, from ${event.startTime.format(format)} - ${event.endTime.format(format)}?`;
    default:
      return 'REMOVE ITEM';
  }
};

export const renderTitle = (item: Deletable) => {
  switch (item.constructor) {
    case AdminSquadronModel:
      return 'DELETE SQUADRON';
    case AirmanCertificationModel:
      return 'REMOVE CERTIFICATION';
    case AirmanModel:
      return 'DELETE MEMBER';
    case AirmanQualificationModel:
      return 'REMOVE QUALIFICATION';
    case EventModel:
      return 'REMOVE EVENT';
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
