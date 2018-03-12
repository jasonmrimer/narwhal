export interface ProfileModel {
  user: UserModel;
  classified: boolean;
}

export interface UserModel {
  id?: number;
  username: string;
  siteId: number | null;
}