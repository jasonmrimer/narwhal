import * as React from 'react';
import { StyledButton } from './Button';
import { shallow, ShallowWrapper } from 'enzyme';
import { DeletePopup, renderItemInformation } from './DeletePopup';
import { AirmanCertificationModelFactory } from '../airman/factories/AirmanCertificationModelFactory';
import Mock = jest.Mock;
import { AirmanQualificationModelFactory } from '../airman/factories/AirmanQualificationModelFactory';

describe('DeletePopup', () => {
  let subject: ShallowWrapper;
  let onClickSpy: Mock;
  let onCancelSpy: Mock;
  beforeEach(() => {
    onClickSpy = jest.fn();
    onCancelSpy = jest.fn();
    subject = shallow(
      <DeletePopup
        item={AirmanCertificationModelFactory.build(1, 1)}
        onConfirm={onClickSpy}
        onCancel={onCancelSpy}
      />
    );
  });

  it('should call the executePendingDelete on delete button click', () => {
    subject.find(StyledButton).at(1).simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });

  it('should call the remove pendingDeleteSkill on cancel click', () => {
    subject.find(StyledButton).at(0).simulate('click');
    expect(onCancelSpy).toHaveBeenCalled();
  });

  it('should render the title text', () => {
    expect(subject.find('.title').text()).toBe('REMOVE CERTIFICATION');
  });

  describe('renderItemInformation', () => {
    it('should render the correct information based the item type', () => {
      expect(renderItemInformation(AirmanCertificationModelFactory.build(1, 1))).toBe('Remove 1?');
      expect(renderItemInformation(AirmanQualificationModelFactory.build(2))).toContain('Remove 2?');
    });
  });
});