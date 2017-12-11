import rosterRepositoryContract from './RosterRepositoryContract';
import WebRosterRepository from './WebRosterRepository';

describe('WebRosterRepository', () => {
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  rosterRepositoryContract(new WebRosterRepository(HOST));
});