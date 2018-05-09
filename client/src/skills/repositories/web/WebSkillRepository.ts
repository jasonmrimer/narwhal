import { QualificationModel } from '../../models/QualificationModel';
import { CertificationModel } from '../../models/CertificationModel';
import { HTTPClient } from '../../../utils/HTTPClient';
import { SkillRepository } from '../SkillRepository';

export class WebSkillRepository implements SkillRepository {

  constructor(private client: HTTPClient) {
  }

  async findAllQualifications(): Promise<QualificationModel[]> {
    const json = await this.client.getJSON('/api/skill/qualifications');
    return json.map((obj: any) => {
      return new QualificationModel(obj.id, obj.acronym, obj.title);
    });
  }

  async findAllCertifications(): Promise<CertificationModel[]> {
    const json = await this.client.getJSON('/api/skill/certifications');
    return json.map((obj: any) => {
      return new CertificationModel(obj.id, obj.title, obj.siteId);
    });
  }
}
