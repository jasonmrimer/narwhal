import RosterModel from '../models/RosterModel';
import RosterRepository from './RosterRepository';

export default class WebRosterRepository implements RosterRepository {
    constructor(private baseUrl: string = '') {}

    findOne(): Promise<RosterModel> {
        return fetch(`${this.baseUrl}/api/roster`).then(resp => resp.json());
    }

    async findByUnit(id: number): Promise<RosterModel> {
      return fetch(`${this.baseUrl}/api/roster?unit=${id}`).then(resp => resp.json());
    }
}