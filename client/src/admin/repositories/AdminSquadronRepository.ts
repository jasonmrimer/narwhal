import { AdminSquadronModel } from '../models/AdminSquadronModel';

export interface AdminSquadronRepository {
  findAll(): Promise<AdminSquadronModel[]>;
}