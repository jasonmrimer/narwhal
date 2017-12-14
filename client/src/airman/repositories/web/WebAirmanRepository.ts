import AirmanRepository from '../AirmanRepository';

export default class WebAirmanRepository implements AirmanRepository {
  constructor(private baseUrl: string = '') {
  }

  findAll() {
    return fetch(`${this.baseUrl}/api/airmen`, {credentials: 'include'})
      .then(resp => resp.json());
  }

  async findByUnit(id: number) {
    return fetch(`${this.baseUrl}/api/airmen?unit=${id}`, {credentials: 'include'})
      .then(resp => resp.json());
  }
}