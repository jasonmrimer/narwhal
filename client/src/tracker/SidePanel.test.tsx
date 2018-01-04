import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { SidePanel } from './SidePanel';
import AirmanModelFactory from '../airman/factories/AirmanModelFactory';
import AirmanModel from '../airman/models/AirmanModel';
import PlannerServiceStub from './services/doubles/PlannerServiceStub';
import Currency from './Currency';
import Availability from './Availability';
import Tab from './Tab';

const clickSpy = jest.fn();
const plannerServiceStub = new PlannerServiceStub();
let airman: AirmanModel;
let subject: ShallowWrapper;

describe('SidePanel', () => {
  beforeEach(() => {
    airman = AirmanModelFactory.build();
    subject = shallow(
      <SidePanel
        airman={airman}
        closeCallback={clickSpy}
        week={plannerServiceStub.getCurrentWeek()}
      />);
  });

  it('shows the airmans name', () => {
    expect(subject.text()).toContain(`${airman.lastName}, ${airman.firstName}`);
  });

  it('shows two tabs', () => {
    expect(subject.find(Tab).length).toBe(2);
    expect(subject.find(Tab).at(0).prop('title')).toBe('CURRENCY');
    expect(subject.find(Tab).at(1).prop('title')).toBe('AVAILABILITY');
  });

  it('renders the availability for a selected airman', () => {
    const availability = subject.find(Availability);
    expect(availability.exists()).toBeTruthy();
  });

  it('renders the currency for a selected airman', () => {
    subject.find(Tab).at(0).simulate('click');
    const currency = subject.find(Currency);
    expect(currency.exists()).toBeTruthy();
  });

  it('makes the tab active when selected', () => {
    subject.find(Tab).at(0).simulate('click');
    expect(subject.find(Tab).at(0).prop('isActive')).toBeTruthy();
    expect(subject.find(Tab).at(1).prop('isActive')).toBeFalsy();

    subject.find(Tab).at(1).simulate('click');
    expect(subject.find(Tab).at(0).prop('isActive')).toBeFalsy();
    expect(subject.find(Tab).at(1).prop('isActive')).toBeTruthy();
  });

  it('calls the click callback', () => {
    subject.find('button').simulate('click');
    expect(clickSpy).toHaveBeenCalled();
  });

});