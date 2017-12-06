import RosterModel from './RosterModel';
import RosterRepository from './RosterRepository';

const airmanOne = { firstName: 'First1', lastName: 'Last1' };
const airmanTwo = { firstName: 'First2', lastName: 'Last2' };
const airmanThree = { firstName: 'First3', lastName: 'Last3' };

export default class RosterRepositoryStub implements RosterRepository {
    findOne() {
        return Promise.resolve(new RosterModel([airmanOne, airmanTwo, airmanThree]));
    }
}