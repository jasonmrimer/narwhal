import { QualificationModel } from '../../models/QualificationModel';
import { HTTPClient } from '../../../../utils/HTTPClient';
import { QualificationRepository } from '../QualificationRepository';

export class WebQualificationRepository implements QualificationRepository {

  constructor(private client: HTTPClient) {
  }

  async findAllQualifications(): Promise<QualificationModel[]> {
    const json = await this.client.getJSON('/api/qualifications');
    return json.map((obj: any) => {
      return new QualificationModel(obj.id, obj.acronym, obj.title);
    });
  }
}
