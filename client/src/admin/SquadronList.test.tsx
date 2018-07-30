import * as React from 'react';
import { AdminSquadronModel } from './models/AdminSquadronModel';
import { AdminSquadronStore } from './stores/AdminSquadronStore';
import { shallow, ShallowWrapper } from 'enzyme';
import { SquadronList } from './SquadronList';
import { AdminSquadronActions } from './actions/AdminSquadronActions';
import { AdminSquadronRepositoryStub } from './repositories/doubles/AdminSquadronRepositoryStub';
import { AdminSiteRepositoryStub } from './repositories/doubles/AdminSiteRepositoryStub';
import { AdminSquadronRepository } from './repositories/AdminSquadronRepository';
import { AdminSiteRepository } from './repositories/AdminSiteRepository';

describe('SquadronList', () => {
  let adminSquadronActions: AdminSquadronActions;
  let adminSquadronStore: AdminSquadronStore;
  let adminSiteRepository: AdminSiteRepository;
  let adminSquadronRepository: AdminSquadronRepository;

  let subject: ShallowWrapper;
  beforeEach(() => {
    const squadrons = [
      new AdminSquadronModel(1, 'Site1', 1, 'Squad1'),
      new AdminSquadronModel(2, 'Site2', 2, 'Squad2')
    ];
    adminSquadronStore = new AdminSquadronStore();
    adminSiteRepository = new AdminSiteRepositoryStub();
    adminSquadronRepository = new AdminSquadronRepositoryStub();
    adminSquadronActions = new AdminSquadronActions({adminSquadronStore}, {
      adminSiteRepository,
      adminSquadronRepository
    });
    adminSquadronStore.hydrate(squadrons);

    subject = shallow(
      <SquadronList
        adminSquadronStore={adminSquadronStore}
        adminSquadronActions={adminSquadronActions}
      />
    );
  });

  it('should display a list of squadrons', () => {
    expect(subject.find('.row').length).toBe(2);
    expect(subject.find('.row').at(0).text()).toContain('Site1/Squad1');
    expect(subject.find('.row').at(1).text()).toContain('Site2/Squad2');
  });
});