import { AdminSiteModel } from '../models/AdminSiteModel';

export interface AdminSiteRepository {
  findAll(): Promise<AdminSiteModel[]>;
}