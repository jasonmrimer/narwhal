import { HTTPClient } from '../../../../utils/HTTPClient';
import { CertificationRepository } from '../CertificationRepository';
import { CertificationModel } from '../../models/CertificationModel';

export class WebCertificationRepository implements CertificationRepository {

  constructor(private client: HTTPClient) {
  }

  async findAllCertifications(): Promise<CertificationModel[]> {
    const json = await this.client.getJSON('/api/certifications');
    return json.map((obj: any) => {
      return new CertificationModel(obj.id, obj.title, obj.siteId);
    });
  }

  async findAllCertificationsBySiteId(siteId: number): Promise<CertificationModel[]> {
    const json = await this.client.getJSON(`/api/certifications?siteId=${siteId}`);
    return json.map((obj: any) => {
      return new CertificationModel(obj.id, obj.title, obj.siteId);
    });
  }

  async findOneCertification(certificationId: number): Promise<CertificationModel> {
    const json = await this.client.getJSON(`/api/certifications/${certificationId}`);

    return new CertificationModel(json.id, json.title, json.siteId);
  }

  async update(certification: CertificationModel): Promise<CertificationModel> {
    const body = JSON.stringify(certification);
    return await this.client.putJSON(`/api/certifications/${certification.id}`, body);
  }
}
