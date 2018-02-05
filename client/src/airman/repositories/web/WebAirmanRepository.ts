import AirmanRepository from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';
import AirmanQualificationModel from '../../models/AirmanQualificationModel';
import AirmanModel from '../../models/AirmanModel';
import * as Cookie from 'js-cookie';
import { AirmanQualificationSerializer } from '../../serializers/AirmanQualificationSerializer';
import AirmanCertificationModel from '../../models/AirmanCertificationModel';
import { AirmanCertificationSerializer } from '../../serializers/AirmanCertificationSerializer';

export default class WebAirmanRepository implements AirmanRepository {
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

  async saveQualification(airmanQual: AirmanQualificationModel): Promise<AirmanModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/airmen/${airmanQual.airmanId}/qualifications`,
      {
        method: 'post',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: this.airmanQualSerializer.serialize(airmanQual),
        credentials: 'include'
      }
    );
    const json = await resp.json();
    return this.serializer.deserialize(json);
  }

  async saveCertification(airmanCert: AirmanCertificationModel): Promise<AirmanModel> {
    const resp = await fetch(
      `${this.baseUrl}/api/airmen/${airmanCert.airmanId}/certifications`,
      {
        method: 'post',
        headers: [['Content-Type', 'application/json'], ['X-XSRF-TOKEN', this.csrfToken]],
        body: this.airmanCertSerializer.serialize(airmanCert),
        credentials: 'include'
      }
    );
    const json = await resp.json();
    return this.serializer.deserialize(json);
  }

}