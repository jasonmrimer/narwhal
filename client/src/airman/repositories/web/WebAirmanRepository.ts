import { AirmanRepository } from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';
import { AirmanModel } from '../../models/AirmanModel';
import { SkillType } from '../../../skills/models/SkillType';
import { Skill } from '../../../skills/models/Skill';
import { HTTPClient } from '../../../utils/HTTPClient';

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
    const json = await this.client.postJSON('/api/airmen', JSON.stringify(airman));
    return this.serializer.deserialize(json);
  }

  async saveSkill(skill: Skill): Promise<AirmanModel> {
    try {
      const body = JSON.stringify(skill);
      const json = skill.id ?
        await this.client.putJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}`, body) :
        await this.client.postJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}`, body);
      return this.serializer.deserialize(json);
    } catch (errorJSON) {
      throw this.handleError(errorJSON);
    }
  }

  async deleteSkill(skill: Skill): Promise<AirmanModel> {
    const json = await this.client.deleteJSON(`/api/airmen/${skill.airmanId}/${this.pathForSkill(skill)}/${skill.id}`);
    return this.serializer.deserialize(json);
  }

  private pathForSkill(skill: Skill): string {
    return {
      [SkillType.Qualification]: 'qualifications',
      [SkillType.Certification]: 'certifications'
    }[skill.type];
  }

  private handleError(response: { errors: object[] }): object {
    return response.errors.map((error: { field: string }) => {
      return {[error.field]: 'This field is required.'};
    });
  }
}
