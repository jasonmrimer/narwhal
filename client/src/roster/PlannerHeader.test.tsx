import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { PlannerHeader } from './PlannerHeader';
import { PlannerStore } from './stores/PlannerStore';
import { TimeServiceStub } from '../tracker/services/doubles/TimeServiceStub';

describe('PlannerHeader', () => {
  let subject: ShallowWrapper;

  beforeEach(() => {
    const eventsRefresher = {
      refreshEvents() {
        return Promise.resolve();
      },
      refreshAirmanEvents() {
        return Promise.resolve();
      }
    };
    const store = new PlannerStore(new TimeServiceStub(), eventsRefresher);
    subject = shallow(<PlannerHeader plannerStore={store}/>);
  });

  it('should render header text', () => {
    expect(subject.text()).toContain('26SUN27MON28TUE29WED30THU01FRI02SAT');
  });

  it('should render next-week button', () => {
    expect(subject.find('button.next-week').exists()).toBeTruthy();
  });

  it('advances to last week on button click', () => {
    expect(subject.find('button.last-week').exists()).toBeTruthy();
  });
});