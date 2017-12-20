import plannerServiceContract from '../PlannerServiceContract';
import PlannerServiceStub from './PlannerServiceStub';

describe('PlannerServiceStub', () => {
  plannerServiceContract(new PlannerServiceStub());
});