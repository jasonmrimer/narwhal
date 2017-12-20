import plannerServiceContract from './PlannerServiceContract';
import { MomentPlannerService } from './MomentPlannerService';

describe('MomentPlannerService', () => {
  plannerServiceContract(new MomentPlannerService());
});