import QualificationRepository from '../QualificationRepository';
import QualificationModel from '../../models/QualificationModel';

export default class WebQualificationRepository implements QualificationRepository {
  constructor(private baseUrl: string = '') {}

  async findAll(): Promise<QualificationModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/qualifications`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: any) => {
      return new QualificationModel(obj.id, obj.acronym, obj.title);
    });
  }
}
