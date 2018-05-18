import { AirmanModel, ShiftType } from '../models/AirmanModel';
import { Skill } from '../../skills/models/Skill';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';

export interface AirmanRepository {
  findOne(airmanId: number): Promise<AirmanModel>;

  findBySiteId(siteId: number): Promise<AirmanModel[]>;

  saveSkill(skill: Skill): Promise<AirmanModel>;

  saveAirman(airman: AirmanModel): Promise<AirmanModel>;

  delete(airman: AirmanModel): Promise<void>;

  deleteSkill(skill: Skill): Promise<AirmanModel>;

  updateShiftByFlightId(flightId: number, shift: ShiftType): Promise<AirmanModel[]>;

  updateScheduleByFlightId(flightId: number, schedule: ScheduleModel): Promise<AirmanModel[]>;
}
