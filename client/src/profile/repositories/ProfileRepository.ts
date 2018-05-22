import { ProfileModel } from '../models/ProfileModel';
import { ErrorResponse } from '../../utils/HTTPClient';

export interface ProfileRepository {
  findAll(): Promise<ProfileModel[] | ErrorResponse>;

  findOne(): Promise<ProfileModel>;

  updateSite(siteId: number): Promise<ProfileModel>;

  updateSiteAndSquadron(siteId: number, squadronId: number): Promise<ProfileModel>;

  save(profile: ProfileModel): Promise<ProfileModel>;

  findAllRoles(): Promise<{ id: number, name: string }[]>;
}
