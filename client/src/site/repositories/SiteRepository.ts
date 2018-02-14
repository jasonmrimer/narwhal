import { SiteModel } from '../models/SiteModel';

export interface SiteRepository {
  findAll(): Promise<SiteModel[]>;
}
