import { AdminSquadronModel } from '../models/AdminSquadronModel';

export interface AdminSquadronRepository {
  findAll(): Promise<AdminSquadronModel[]>;
  saveSquadron(squadron: AdminSquadronModel): Promise<AdminSquadronModel>;
  delete(id: number): Promise<void>;
}