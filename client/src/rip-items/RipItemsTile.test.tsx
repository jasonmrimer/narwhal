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
        hasExpiredRipItem={false}
      />
    );
  });

  it('should give feedback for onClick', () => {
    subject.simulate('click');
    expect(onClickSpy).toBeCalled();
  });

  it('should render an ExpirationAlert when hasExpiredRipItem is true', () => {
    expect(subject.find(StyledExpirationSleeve).exists()).toBeFalsy();
    subject.setProps({hasExpiredRipItem: true});
    expect(subject.find(StyledExpirationSleeve).exists()).toBeTruthy();
  });

  it('should render the title', () => {
    expect(subject.find('span').at(0).text()).toBe('title');
  });

  it('should render the number of assigned items', () => {
    expect(subject.find('span').at(1).text()).toBe('10 task(s) assigned')
  });
});
