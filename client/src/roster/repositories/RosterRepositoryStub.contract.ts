import rosterRepositoryContract from './RosterRepositoryContract';
import RosterRepositoryStub from './RosterRepositoryStub';

describe('RosterRepositoryStub', () => {
    rosterRepositoryContract(new RosterRepositoryStub());
});