import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { ConfirmationPopup } from './ConfirmationPopup';

describe('ConfirmationPopup', () => {
  let subject: ReactWrapper;
  let onBack: jest.Mock<any>;
  let onConfirm: jest.Mock<any>;

  beforeEach(() => {
    onBack = jest.fn();
    onConfirm = jest.fn();

    subject = mount(
      <ConfirmationPopup
        title={'LAZER VISION'}
        siteName={'Test Site'}
        onCancel={onBack}
        onConfirm={onConfirm}
      />);

  });

  it('should display a descriptive confirmation dialog', () => {
    expect(subject.text()).toContain('LAZER VISION');
    expect(subject.text()).toContain('Test Site');
  });
});