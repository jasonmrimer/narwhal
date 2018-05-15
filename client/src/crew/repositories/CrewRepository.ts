import { CrewModel } from '../models/CrewModel';
import { EventModel } from '../../event/models/EventModel';

export interface CrewRepository {
  save(event: EventModel): Promise<EventModel>;
  findOne(id: number): Promise<CrewModel>;
}