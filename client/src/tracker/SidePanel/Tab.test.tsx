import * as React from 'react';
import { shallow } from 'enzyme';
import { ActiveBorder, Tab } from './Tab';

describe('Tab', () => {
  const clickSpy = jest.fn();
  const subject = shallow(<Tab title={'Title'} onClick={clickSpy} isActive={false}/>);

  it('shows the tab title', () => {
    expect(subject.text()).toBe('Title');
  });

  it('calls the onClick callback when clicked', () => {
    subject.find('a').simulate('click');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('has an active border component when isActive', () => {
    subject.setProps({isActive: true});
    expect(subject.find(ActiveBorder).exists()).toBeTruthy();
  });
});