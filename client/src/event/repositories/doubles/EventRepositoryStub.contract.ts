import EventRepositoryContract from '../EventRepositoryContract';
import EventRepositoryStub from './EventRepositoryStub';

describe('EventRepositoryStub', () => {
EventRepositoryContract(new EventRepositoryStub());
});
