import { AdminSquadronActions } from './AdminSquadronActions';
import { AdminSiteRepositoryStub } from '../repositories/doubles/AdminSiteRepositoryStub';
import { AdminSiteModel } from '../models/AdminSiteModel';
import { AdminSquadronModel } from '../models/AdminSquadronModel';

describe('AdminSquadronActions', () => {
  let adminSquadronStore: any;
  let adminSiteRepository: AdminSiteRepositoryStub;
  let subject: AdminSquadronActions;

  beforeEach(() => {
    adminSiteRepository = new AdminSiteRepositoryStub();
    adminSquadronStore = {
      defaultPendingSquadron: jest.fn(),
      pendingSquadron: {
        setSiteId: jest.fn(),
        setSiteName: jest.fn(),
        setSquadronName: jest.fn(),
        siteId: 14
      },
      performLoading: jest.fn(),
      setPendingSquadron: jest.fn(),
      setSites: jest.fn(),
      showDelete: jest.fn(),
      sites: [
        new AdminSiteModel(1, 'Site One'),
        new AdminSiteModel(14, 'Site Fourteen')
      ]
    };

    subject = new AdminSquadronActions(
      {adminSquadronStore} as any,
      {adminSiteRepository} as any
    );
  });

  it('should show the add squadron popup', async () => {
    await subject.showAddSquadron();
    expect(adminSquadronStore.setPendingSquadron).toHaveBeenCalled();
    expect(adminSquadronStore.setSites).toHaveBeenCalledWith(await adminSiteRepository.findAll());
  });

  it('should hide the add squadron popup on cancel', () => {
    subject.hideAddSquadron();
    expect(adminSquadronStore.defaultPendingSquadron).toHaveBeenCalled();
  });

  it('should set the pendingSquadron site', async () => {
    await subject.showAddSquadron();
    const site = {value: 14, label: 'Site Fourteen'};
    subject.onSquadronSiteChange(site);
    expect(adminSquadronStore.pendingSquadron.setSiteId).toHaveBeenCalledWith(site.value);
    expect(adminSquadronStore.pendingSquadron.setSiteName).toHaveBeenCalledWith(site.label);
  });

  it('should set the pendingSquadron name', async () => {
    await subject.showAddSquadron();
    const name = 'Squadron One';
    subject.onSquadronNameChange(name);
    expect(adminSquadronStore.pendingSquadron.setSquadronName).toHaveBeenCalledWith(name);
  });

  it('should show selected site', async () => {
    await subject.showAddSquadron();
    expect(subject.selectedSite!.value).toEqual(14);
  });

  it('should perform loading', async () => {
    await subject.performLoading(async () => { return; });
    expect(adminSquadronStore.performLoading).toHaveBeenCalled();
  });

  it('should show delete button', () => {
    const squad =  new AdminSquadronModel(
      1,
      'site',
      1,
      'squadron',
      0);
    subject.showDeleteForSquadron(squad);
    expect(adminSquadronStore.showDelete).toHaveBeenCalled();
  });
});