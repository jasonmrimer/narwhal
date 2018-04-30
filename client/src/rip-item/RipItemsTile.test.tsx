import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { RipItemsTile } from './RipItemsTile';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';
import Mock = jest.Mock;

describe('RipItemsTile', () => {
  let subject: ShallowWrapper;
  let onClickSpy: Mock;
  onClickSpy = jest.fn();

  beforeEach(async () => {
    subject = shallow(
      <RipItemsTile
        title="title"
        onClick={onClickSpy}
        expiredItemCount={1}
        assignedItemCount={1}
      />
    );
  });

  it('should give feedback for onConfirm', () => {
    subject.simulate('click');
    expect(onClickSpy).toBeCalled();
  });

  describe('expired items', () => {
    it('should render an ExpirationAlert when expiredItemCount is greater than 0', () => {
      expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
    });

    it('should render the number of expired items when expiredItemCount is greater than 0', () => {
      expect(subject.find('span.expired-count').text()).toBe('1 task(s) expired');
    });
  });

  it('should render the title', () => {
    expect(subject.find('span').at(0).text()).toBe('title');
  });

  it('should render the number of assigned items', () => {
    expect(subject.find('.assigned-count').at(0).text()).toBe('1 task(s) assigned');
  });
});
