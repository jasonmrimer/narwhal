import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Mock = jest.Mock;
import { StyledPopupModal } from './PopupModal';
import { Button } from '../buttons/Button';

describe('PopupModal', () => {
  let subject: ReactWrapper;
  let onCancelSpy: Mock;
  let onConfirmSpy: Mock;
  beforeEach(() => {
    onCancelSpy = jest.fn();
    onConfirmSpy = jest.fn();
    subject = mount(
      <StyledPopupModal
        title="Schedule Settings"
        onCancel={onCancelSpy}
        onConfirm={onConfirmSpy}
      >
        Children
      </StyledPopupModal>
    );
  });

  it('should have a functioning Back button', () => {
    subject.find(Button).at(0).simulate('click');
    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should have a functioning Confirm button', () => {
    subject.find(Button).at(1).simulate('click');
    expect(onConfirmSpy).toHaveBeenCalled();
  });

  it('should set title', () => {
    expect(subject.find('.confirmation .title').text()).toContain('Schedule Settings');
  });
});