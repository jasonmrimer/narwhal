import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { TopBar } from './TopBar';
import { NavLink } from 'react-router-dom';

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
    expect(subject.find(NavLink).length).toBe(2);
  });

  it('should render a link to the Dashboard page', () => {
    expect(subject.find(NavLink).at(0).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(0).prop('to')).toBe('/dashboard');
  });

  it('should render a link to the Availability page', () => {
    expect(subject.find(NavLink).at(1).exists()).toBeTruthy();
    expect(subject.find(NavLink).at(1).prop('to')).toBe('/');
  });
});