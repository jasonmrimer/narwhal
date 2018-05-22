import { Ability } from '@casl/ability';

export interface ProfileModel {
  id: number;
  username: string;
  siteId: number | null;
  siteName: string;
  roleId: number;
  roleName: string;
  classified: boolean;
  squadronId?: number;
  ability?: Ability;
}