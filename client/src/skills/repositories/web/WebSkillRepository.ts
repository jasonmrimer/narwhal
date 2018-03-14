import { QualificationModel } from '../../models/QualificationModel';
import SkillRepository from '../SkillRepository';
import { CertificationModel } from '../../models/CertificationModel';
import { HTTPClient } from '../../../HTTPClient';

/* tslint:disable:no-any */
export class WebSkillRepository implements SkillRepository {

  constructor(private client: HTTPClient) {
  }

  async findAllQualifications(): Promise<QualificationModel[]> {
    const json = await this.client.getJSON('/api/skills/qualifications');
    return json.map((obj: any) => {
      return new QualificationModel(obj.id, obj.acronym, obj.title);
    });
  }

  async findAllCertifications(): Promise<CertificationModel[]> {
    const json = await this.client.getJSON('/api/skills/certifications');
    return json.map((obj: any) => {
      return new CertificationModel(obj.id, obj.title, obj.siteId);
    });
  }
}
