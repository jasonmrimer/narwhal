import { AirmanRepository } from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';
import { AirmanModel } from '../../models/AirmanModel';
import * as Cookie from 'js-cookie';
import { SkillType } from '../../../skills/models/SkillType';
import { Skill } from '../../../skills/models/Skill';

/* tslint:disable:no-any*/
export class WebAirmanRepository implements AirmanRepository {
  private serializer = new AirmanSerializer();
  private csrfToken: string;
  constructor(private baseUrl: string = '') {
    this.csrfToken = Cookie.get('XSRF-TOKEN') || '';
  }

  async findAll() {
    const resp = await fetch(`${this.baseUrl}/api/airmen`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => {
      return this.serializer.deserialize(obj);
    });
  }

  async findBySquadron(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/airmen?squadron=${id}`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => {
      return this.serializer.deserialize(obj);
    });
  }

  async findByFlight(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/airmen?flight=${id}`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => {
      return this.serializer.deserialize(obj);
    });
  }

  async saveSkill(skill: Skill): Promise<AirmanModel> {
    const resp = skill.id ? await this.updateSkill(skill) : await this.createSkill(skill);
    const json = await resp.json();
    if (resp.status === 400) {
      throw this.handleError(json);
    }
    return Promise.resolve(this.serializer.deserialize(json));
  }

  async saveAirman(airman: AirmanModel): Promise<AirmanModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/airmen`,
      {
        method: 'POST',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: JSON.stringify(airman),
        credentials: 'include'
      }
    );

    const json = await resp.json();
    return this.serializer.deserialize(json);
  }

  async deleteSkill(skill: Skill): Promise<AirmanModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/airmen/${skill.airmanId}/${this.getResourceForSkill(skill)}/${skill.id}`,
      {
        method: 'DELETE',
        headers: [['X-XSRF-TOKEN', this.csrfToken]],
        credentials: 'include'
      }
    );

    if (resp.status < 200 || resp.status >= 300) {
      throw new Error(`Unable to delete skill with ID: ${skill.id}`);
    }

    const json = await resp.json();

    return Promise.resolve(this.serializer.deserialize(json));
  }

  private createSkill(skill: Skill) {
    return fetch(
      `${this.baseUrl}/api/airmen/${skill.airmanId}/${this.getResourceForSkill(skill)}`,
      {
        method: 'POST',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: JSON.stringify(skill),
        credentials: 'include'
      }
    );
  }

  private updateSkill(skill: Skill) {
    return fetch(
      `${this.baseUrl}/api/airmen/${skill.airmanId}/${this.getResourceForSkill(skill)}`,
      {
        method: 'PUT',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: JSON.stringify(skill),
        credentials: 'include'
      }
    );
  }

  private getResourceForSkill(skill: Skill): string {
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
