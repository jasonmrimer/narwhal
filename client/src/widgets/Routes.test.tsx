import * as React from 'react';
import { Route, Switch } from 'react-router';
import { shallow } from 'enzyme';
import { Routes } from './Routes';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DashboardStore } from '../dashboard/stores/DashboardStore';
import { makeFakeTrackerStore } from '../utils/testUtils';
import { DoubleRepositories } from '../utils/Repositories';
import { MissionPlannerStore } from '../crew/stores/MissionPlannerStore';
import { AdminStore } from '../admin/stores/AdminStore';

describe('Routes', () => {
  it('should support 4 routes', async () => {
    const trackerStore = await makeFakeTrackerStore();
    const dashboardStore = new DashboardStore(DoubleRepositories);
    const profileStore = new ProfileSitePickerStore(DoubleRepositories);
    const missionPlannerStore = new MissionPlannerStore(DoubleRepositories, profileStore);
    const adminStore = new AdminStore(DoubleRepositories.profileRepository);

    const subject = shallow(
      <Routes
        dashboardStore={dashboardStore}
        trackerStore={trackerStore}
        profileStore={profileStore}
        missionPlannerStore={missionPlannerStore}
        adminStore={adminStore}
      />
    );
    expect(subject.find(Switch).children().length).toBe(5);
    expect(subject.find(Route).at(0).prop('path')).toBe('/');
    expect(subject.find(Route).at(1).prop('path')).toBe('/upload');
    expect(subject.find(Route).at(2).prop('path')).toBe('/dashboard');
    expect(subject.find(Route).at(3).prop('path')).toBe('/dashboard/crew/:id');
    expect(subject.find(Route).at(4).prop('path')).toBe('/admin');
  });
});