import AirmanModel from '../models/AirmanModel';
import { Skill } from '../../skills/models/Skill';

interface AirmanRepository {
  findAll(): Promise<AirmanModel[]>;

  findBySquadron(id: number): Promise<AirmanModel[]>;

  findByFlight(id: number): Promise<AirmanModel[]>;

  saveSkill(skill: Skill): Promise<AirmanModel>;

  deleteSkill(skill: Skill): Promise<AirmanModel>;
}

export default AirmanRepository;