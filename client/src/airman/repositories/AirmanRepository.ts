import { AirmanModel } from '../models/AirmanModel';
import { Skill } from '../../skills/models/Skill';

export interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  saveSkill(skill: Skill): Promise<AirmanModel>;

  saveAirman(airman: AirmanModel): Promise<AirmanModel>;

  deleteSkill(skill: Skill): Promise<AirmanModel>;
}
