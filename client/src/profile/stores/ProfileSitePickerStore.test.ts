import { ProfileSitePickerStore } from './ProfileSitePickerStore';
import { DoubleRepositories } from '../../utils/Repositories';
import { SiteModel, SiteType } from '../../site/models/SiteModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { makeFakeProfile } from '../../utils/testUtils';
import {adminAbility, readerAbility, writerAbility} from '../../app/abilities';

describe('ProfileSitePickerStore', () => {
  let subject: ProfileSitePickerStore;
  const squadron = new SquadronModel(1, 'squad', []);

  beforeEach(async () => {
    subject = new ProfileSitePickerStore(DoubleRepositories);
    const sites = [
        new SiteModel(1, 'JoshPC', [squadron], SiteType.GuardSite, ''),
        new SiteModel(14, 'CoryPc', [], SiteType.DMSSite, ''),
        new SiteModel(5, 'CoryPc', [], SiteType.DGSCoreSite, '')
    ];
    await subject.hydrate(sites, {
      id: 1,
      username: 'FontFace',
      siteId: 14,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false
    });
  });

  it('should return profile', async () => {
    expect(subject.profile).toEqual({
      id: 1,
      username: 'FontFace',
      siteId: 14,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false
    });
  });

  it('should save the selected site it to the profile', async () => {
    subject.setPendingSite(subject.guardSites[0]);
    await subject.savePendingSite();
    expect(subject.profile!.siteId).toEqual(1);
  });

  it('should save the selected site and squadron to the profile', async () => {
    subject.setPendingSite(subject.guardSites[0]);
    subject.setPendingSquadron(squadron);
    await subject.savePendingSite();
    expect(subject.profile!.squadronId).toBe(1);
  });

  it('should separate sites by site types', () => {
    expect(subject.dgsCoreSites.length).toBe(1);
    expect(subject.dgsCoreSites[0].siteType).toBe(SiteType.DGSCoreSite);

    expect(subject.dmsSites.length).toBe(1);
    expect(subject.dmsSites[0].siteType).toBe(SiteType.DMSSite);

    expect(subject.guardSites.length).toBe(1);
    expect(subject.guardSites[0].siteType).toBe(SiteType.GuardSite);
  });

  it('should set pending squadron correctly', () => {
    expect(subject.pendingSquadron).toBe(null);
    subject.setPendingSquadron(squadron);
    expect(subject.pendingSquadron).toBe(squadron);
  });

  it('should reset profile', () => {
    const resetProfileSpy = jest.fn();
    DoubleRepositories.profileRepository.resetProfile = resetProfileSpy;
    subject.resetProfile();
    expect(resetProfileSpy).toHaveBeenCalled();
  });

  it('should provide whether they have pending Requests for Admin/Writer', async () => {
    const pendingRequestSpy = jest.fn();
    DoubleRepositories.eventRepository.hasPendingRequests = pendingRequestSpy;
    await subject.hydrate([], makeFakeProfile('ADMIN', adminAbility));
    await subject.hydrate([], makeFakeProfile('WRITER', writerAbility));
    expect(pendingRequestSpy).toHaveBeenCalledTimes(2);
  });

  it('should provide false for pending Requests for Reader', async () => {
    const pendingRequestSpy = jest.fn();
    DoubleRepositories.eventRepository.hasPendingRequests = pendingRequestSpy;
    await subject.hydrate([], makeFakeProfile('READER', readerAbility));
    expect(pendingRequestSpy).toHaveBeenCalledTimes(0);
    expect(subject.hasPendingRequests).toBeFalsy();
  });
});