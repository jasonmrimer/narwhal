import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { DeletePopup, renderItemInformation } from './DeletePopup';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import Mock = jest.Mock;
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';

describe('DeletePopup', () => {
  let subject: ReactWrapper;
  let onClickSpy: Mock;
  let onCancelSpy: Mock;
  beforeEach(() => {
    onClickSpy = jest.fn();
    onCancelSpy = jest.fn();
    subject = mount(
      <DeletePopup
        item={AirmanCertificationModelFactory.build(1, 1)}
        onConfirm={onClickSpy}
        onCancel={onCancelSpy}
      />
    );
  });

  it('should render the title text', () => {
    expect(subject.find('.title').text()).toContain('REMOVE CERTIFICATION');
  });

  describe('renderItemInformation', () => {
    it('should render the correct information based the item type', () => {
      expect(renderItemInformation(AirmanCertificationModelFactory.build(1, 1))).toBe('Remove 1?');
      expect(renderItemInformation(AirmanQualificationModelFactory.build(2))).toContain('Remove 2?');
    });
  });
});