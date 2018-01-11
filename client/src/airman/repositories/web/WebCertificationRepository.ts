import CertificationRepository from '../CertificationRepository';
import CertificationModel from '../../models/CertificationModel';
import { CertificationSerializer } from '../../serializers/CertificationSerializer';

export default class WebCertificationRepository implements CertificationRepository {
  private serializer: CertificationSerializer = new CertificationSerializer();

  constructor(private baseUrl: string = '') {
  }

  async findAll(): Promise<CertificationModel[]> {
    const resp = await fetch(`${this.baseUrl}/api/certifications`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => this.serializer.deserialize(obj));
  }
}
