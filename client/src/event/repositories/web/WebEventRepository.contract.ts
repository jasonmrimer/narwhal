import { EventRepositoryContract } from '../EventRepositoryContract';
import { WebEventRepository } from './WebEventRepository';
import { HTTPClient } from '../../../utils/HTTPClient';

describe('WebEventRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  EventRepositoryContract(new WebEventRepository(client));
});
