import * as React from 'react';
import { ActiveBorder, InactiveBorder, Tab } from './Tab';
import { shallow, ShallowWrapper } from 'enzyme';

let subject: ShallowWrapper;
const clickSpy = jest.fn();
describe('Tab', () => {
  beforeEach(() => {
    subject = shallow(<Tab title={'Title'} onClick={clickSpy} isActive={false}/>);
  });

  it('shows the tab title', () => {
    expect(subject.find(InactiveBorder).children().text()).toBe('Title');
    subject.setProps({isActive: true});
    expect(subject.find(ActiveBorder).children().text()).toBe('Title');
  });

  it('calls the onClick callback when clicked', () => {
    subject.find(InactiveBorder).simulate('click');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('has an active border component when isActive', () => {
    subject.setProps({isActive: true});
    expect(subject.find(ActiveBorder).exists()).toBeTruthy();
  });
});