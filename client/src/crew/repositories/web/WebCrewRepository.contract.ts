import CrewRepositoryContract from '../CrewRepositoryContract';
import WebCrewRepository from './WebCrewRepository';

describe('WebCrewRepository', () => {
const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
CrewRepositoryContract(new WebCrewRepository(HOST));
});
