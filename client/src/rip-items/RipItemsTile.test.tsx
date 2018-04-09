import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { RipItemsTile } from './RipItemsTile';
import { StyledExpirationSleeve } from '../widgets/ExpirationSleeve';
import Mock = jest.Mock;

describe('RipItemsTile', () => {
  let subject: ShallowWrapper;
  let onClickSpy: Mock;
  onClickSpy = jest.fn();

  beforeEach(() => {
    subject = shallow(
      <RipItemsTile
        title="title"
        onClick={onClickSpy}
        assignedItemCount={10}
        expiredItemCount={0}
      />
    );
  });

  it('should give feedback for onClick', () => {
    subject.simulate('click');
    expect(onClickSpy).toBeCalled();
  });

  describe('expired items', () => {
    it('should render an ExpirationAlert when expiredItemCount is greater than 0', () => {
      expect(subject.find(StyledExpirationSleeve).exists()).toBeFalsy();
      subject.setProps({expiredItemCount: 20});
      expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
    });

    it('should render the number of expired items when expiredItemCount is greater than 0', () => {
      expect(subject.find('span').length).toBe(2);
      subject.setProps({expiredItemCount: 20});
      expect(subject.find('span').length).toBe(3);
      expect(subject.find('span').at(2).text()).toBe('20 task(s) expired');
    });
  });

  it('should render the title', () => {
    expect(subject.find('span').at(0).text()).toBe('title');
  });

  it('should render the number of assigned items', () => {
    expect(subject.find('span').at(1).text()).toBe('10 task(s) assigned');
  });
});
