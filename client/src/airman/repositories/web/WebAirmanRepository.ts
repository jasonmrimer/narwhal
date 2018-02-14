import { AirmanRepository } from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';
import { AirmanModel } from '../../models/AirmanModel';
import * as Cookie from 'js-cookie';
import { AirmanQualificationSerializer } from '../../serializers/AirmanQualificationSerializer';
import { AirmanCertificationSerializer } from '../../serializers/AirmanCertificationSerializer';
import { Skill } from '../../../skills/models/Skill';
import { SkillType } from '../../../skills/models/SkillType';

/* tslint:disable:no-any*/
export class WebAirmanRepository implements AirmanRepository {
  private serializer = new AirmanSerializer();
  private airmanQualSerializer = new AirmanQualificationSerializer();
  private airmanCertSerializer = new AirmanCertificationSerializer();
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
        body: this.getBodyForSkill(skill),
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
        body: this.getBodyForSkill(skill),
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

  private getBodyForSkill(skill: Skill): {} {
    return {
      [SkillType.Qualification]: (s: any) => this.airmanQualSerializer.serialize(s),
      [SkillType.Certification]: (s: any) => this.airmanCertSerializer.serialize(s)
    }[skill.type](skill);
  }

  private handleError(response: { errors: object[] }): object {
    return response.errors.map((error: { field: string }) => {
      return {[error.field]: 'Field is required'};
    });
  }
}
