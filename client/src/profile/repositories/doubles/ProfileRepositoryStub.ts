import { ProfileRepository } from '../ProfileRepository';
import { ProfileModel } from '../../models/ProfileModel';

export class ProfileRepositoryStub implements ProfileRepository {
  findAll(): Promise<ProfileModel[]> {
    return Promise.resolve([
      {
        id: 1,
        username: 'FontFace',
        siteId: 14,
        siteName: 'SITE 14',
        roleId: 1,
        roleName: 'ADMIN',
        classified: false,
      },
      {
        id: 2,
        username: 'Mr. Roboto',
        siteId: 14,
        siteName: 'SITE 14',
        roleId: 1,
        roleName: 'ADMIN',
        classified: false,
      },
      {
        id: 3,
        username: 'Mr. None Adminface',
        siteId: 42,
        siteName: 'SITE 42',
        roleId: 3,
        roleName: 'READER',
        classified: false
      }
    ]);
  }

  findOne(): Promise<ProfileModel> {
    return Promise.resolve({
      id: 1,
      username: 'FontFace',
      siteId: 14,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false,
    });
  }

  updateSite(siteId: number): Promise<ProfileModel> {
    return Promise.resolve({
      id: 1,
      username: 'FontFace',
      siteId: siteId,
      siteName: 'SITE 14',
      roleId: 1,
      roleName: 'ADMIN',
      classified: false,
    });
  }

  save(profile: ProfileModel): Promise<ProfileModel> {
    return Promise.resolve(profile);
  }

  findAllRoles(): Promise<{ id: number; name: string }[]> {
    return Promise.resolve([
      {id: 1, name: 'ADMIN'},
      {id: 2, name: 'WRITER'},
      {id: 3, name: 'READER'}
    ]);
  }

}
