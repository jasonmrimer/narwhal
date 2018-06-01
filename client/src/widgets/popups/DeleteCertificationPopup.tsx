import * as React from 'react';
import styled from 'styled-components';
import { StyledPopupModal } from './PopupModal';

interface Props {
  title: string;
  siteName: string;
  onCancel: () => void;
  onConfirm: () => void;
  className?: string;
}

export class DeleteCertificationPopup extends React.Component<Props> {
  render() {
    return (
      <StyledPopupModal
        title="DELETE CERTIFICATION"
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
        className={this.props.className}
      >
        <div className="content">
          {`Delete ${this.props.title}? ` +
            `This will also remove the ${this.props.title} ` +
          `certification from any ${this.props.siteName} airman that has it.`}
        </div>
      </StyledPopupModal>
    );
  }
}

export const StyledDeleteCertificationPopup = styled(DeleteCertificationPopup)``;