import { AirmanRepository } from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';
import { AirmanModel, ShiftType } from '../../models/AirmanModel';
import { SkillType } from '../../../skills/models/SkillType';
import { Skill } from '../../../skills/models/Skill';
import { HTTPClient } from '../../../utils/HTTPClient';
import { ScheduleModel } from '../../../schedule/models/ScheduleModel';
import { Moment } from 'moment';

export class WebAirmanRepository implements AirmanRepository {
  private serializer = new AirmanSerializer();

  constructor(private client: HTTPClient) {
  }

  async findOne(airmanId: number): Promise<AirmanModel> {
    const json = await this.client.getJSON(`/api/airmen/${airmanId}`);
    return this.serializer.deserialize(json);
  }

  async findBySiteId(siteId: number) {
    const json = await this.client.getJSON(`/api/airmen?siteId=${siteId}`);
    return json.map((item: any) => this.serializer.deserialize(item));
  }

  async saveAirman(airman: AirmanModel): Promise<AirmanModel> {
    const json = airman.id > -1 ?
      await this.client.putJSON('/api/airmen', JSON.stringify(airman)) :
      await this.client.postJSON('/api/airmen', JSON.stringify(airman));
    return this.serializer.deserialize(json);
  }

  async delete(airman: AirmanModel): Promise<void> {
    await this.client.delete(`/api/airmen/${airman.id}`);
  }

  async saveSkill(skill: Skill): Promise<AirmanModel> {
    const body = JSON.stringify(skill);
    const json = skill.id ?
      await this.client.putJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}`, body) :
      await this.client.postJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}`, body);
    return this.serializer.deserialize(json);
  }

  async deleteSkill(skill: Skill): Promise<AirmanModel> {
    const json = await this.client.deleteJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}/${skill.id}`);
    return this.serializer.deserialize(json);
  }

  async updateShiftByFlightId(flightId: number, shift: ShiftType): Promise<AirmanModel[]> {
    const body = JSON.stringify({shiftType: shift});
    const json = await this.client.putJSON(`/api/airmen/shift?flightId=${flightId}`, body);
    return json.map((item: any) => this.serializer.deserialize(item));
  }

  async updateScheduleByFlightId(flightId: number, schedule: ScheduleModel, startDate: Moment | null)
    : Promise<AirmanModel[]> {
    const body = JSON.stringify(schedule);
    let url = `/api/airmen/schedules?flightId=${flightId}`;
    if (startDate) {
      url = url + `&startDate=${startDate.utc().format()}`;
    }
    const json = await this.client.putJSON(url , body);
    return json.map((item: any) => this.serializer.deserialize(item));
  }

  private pathForSkill(skill: Skill): string {
    return {
      [SkillType.Qualification]: 'qualifications',
      [SkillType.Certification]: 'certifications'
    }[skill.type];
  }
}
