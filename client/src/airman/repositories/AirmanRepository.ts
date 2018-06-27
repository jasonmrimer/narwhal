import { AirmanModel, ShiftType } from '../models/AirmanModel';
import { Skill } from '../../skills/models/Skill';
import { ScheduleModel } from '../../schedule/models/ScheduleModel';
import { Moment } from 'moment';

export interface AirmanRepository {
  findOne(airmanId: number): Promise<AirmanModel>;

  findBySiteId(siteId: number): Promise<AirmanModel[]>;

  saveSkill(skill: Skill): Promise<AirmanModel>;

  saveAirman(airman: AirmanModel): Promise<AirmanModel>;

  delete(airman: AirmanModel): Promise<void>;

  deleteSkill(skill: Skill): Promise<AirmanModel>;

  updateShiftByFlightId(flightId: number, shift: ShiftType, airmenIds: number[]): Promise<AirmanModel[]>;

  updateScheduleByFlightId(flightId: number, schedule: ScheduleModel, airmenIds: number[], startDate: Moment | null): Promise<AirmanModel[]>;
}
