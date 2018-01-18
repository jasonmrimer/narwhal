import EventRepositoryContract from '../EventRepositoryContract';
import WebEventRepository from './WebEventRepository';

describe('WebEventRepository', () => {
const HOST = process.env.REACT_APP_HOST || 'http://localhost:8080';
  EventRepositoryContract(new WebEventRepository(HOST));
});
