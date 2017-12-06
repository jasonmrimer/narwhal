import RosterModel from './RosterModel';
import RosterRepository from './RosterRepository';

export default class WebRosterRepository implements RosterRepository {
    constructor(private baseUrl: string = '') { }

    findOne(): Promise<RosterModel> {
        return fetch(`${this.baseUrl}/api/roster`).then(resp => resp.json());
    }
}