import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';
import { Link } from 'react-router-dom';
import { StyledTopBarTab } from './TopBarTab';

describe('TopBar', () => {
  let subject: ShallowWrapper;

  beforeEach(() => {
    subject = shallow(<TopBar username="Tytus"/>);
  });

  it('renders the username', () => {
    expect(subject.text()).toContain('Tytus');
  });

  it('renders the page title', () => {
    expect(subject.text()).toContain('Narwhal');
  });

  it('renders a Mission and Availability tab', () => {
    expect(subject.find(StyledTopBarTab).length).toBe(2);
  });

  it('should become active if clicked', () => {
    expect(subject.find(StyledTopBarTab).at(0).prop('isActive')).toBeFalsy();
    subject.find(StyledTopBarTab).at(0).simulate('click');
    expect(subject.find(StyledTopBarTab).at(0).prop('isActive')).toBeTruthy();
  });

  it('should render a link to the Dashboard page', () => {
    expect(subject.find(Link).at(0).exists()).toBeTruthy();
    expect(subject.find(Link).at(0).prop('to')).toBe('/dashboard');
  });

  it('should render a link to the Availability page', () => {
    expect(subject.find(Link).at(1).exists()).toBeTruthy();
    expect(subject.find(Link).at(1).prop('to')).toBe('/');
  });
});