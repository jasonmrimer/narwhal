
import QualificationModel from '../../models/QualificationModel';
import SkillRepository from '../SkillRepository';
import CertificationModel from '../../models/CertificationModel';

export default class WebSkillRepository implements SkillRepository {
  constructor(private baseUrl: string = '') {}

  async findAllQualifications(): Promise<QualificationModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/skills/qualifications`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: any) => {
      return new QualificationModel(obj.id, obj.acronym, obj.title);
    });
  }

  async findAllCertifications(): Promise<CertificationModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/skills/certifications`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: any) => {
      return new CertificationModel(obj.id, obj.title);
    });
  }
}
