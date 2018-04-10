import { EventRepositoryContract } from '../EventRepositoryContract';
import { FakeEventRepository } from './FakeEventRepository';

describe('FakeEventRepository', () => {
  EventRepositoryContract(new FakeEventRepository());
});
