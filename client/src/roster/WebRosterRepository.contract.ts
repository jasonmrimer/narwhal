import rosterRepositoryContract from './RosterRepositoryContract';
import WebRosterRepository from './WebRosterRepository';

describe('WebRosterRepository', () => {
    rosterRepositoryContract(new WebRosterRepository('http://localhost:8080'));
});