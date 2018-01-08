import AirmanRepository from '../AirmanRepository';
import { AirmanSerializer } from '../../serializers/AirmanSerializer';

export default class WebAirmanRepository implements AirmanRepository {
  private serializer: AirmanSerializer = new AirmanSerializer();

  constructor(private baseUrl: string = '') {
  }

  async findAll() {
    const resp = await fetch(`${this.baseUrl}/api/airmen`, {credentials: 'include'});
    const json = await resp.json();
    return json.map((obj: object) => {
      return this.serializer.deserialize(obj);
    });
  }

  async findByUnit(id: number) {
    const resp = await fetch(`${this.baseUrl}/api/airmen?unit=${id}`, {credentials: 'include'});
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
}