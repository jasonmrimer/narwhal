import * as React from 'react';
import { Route, Switch } from 'react-router';
import { shallow } from 'enzyme';
import { Routes } from './Routes';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { CrewStore } from '../crew/stores/CrewStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { DoubleRepositories } from '../Repositories';

describe('Routes', () => {
  it('should support 4 routes', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const dashboardStore = new DashboardStore(DoubleRepositories);
    const crewStore = new CrewStore(DoubleRepositories);
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);

    const subject = shallow(
      <Routes
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
        crewStore={crewStore}
        profileStore={profileStore}
      />
    );
    expect(subject.find(Switch).children().length).toBe(4);
    expect(subject.find(Route).at(0).prop('path')).toBe('/');
    expect(subject.find(Route).at(1).prop('path')).toBe('/upload');
    expect(subject.find(Route).at(2).prop('path')).toBe('/dashboard');
    expect(subject.find(Route).at(3).prop('path')).toBe('/crew/:id');
  });
});