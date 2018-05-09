import { WebRankRepository } from './WebRankRepository';
import { HTTPClient } from '../../../utils/HTTPClient';
import { RankRepositoryContract } from '../RankRepositoryContract';

describe('WebRankRepository', () => {
  const client = new HTTPClient(process.env.REACT_APP_HOST || 'http://localhost:8080');
  RankRepositoryContract(new WebRankRepository(client));
});
