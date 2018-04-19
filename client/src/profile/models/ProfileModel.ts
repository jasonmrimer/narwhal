export interface ProfileModel {
  id: number;
  username: string;
  siteId: number | null;
  siteName: string;
  role: string;
  classified: boolean;
}