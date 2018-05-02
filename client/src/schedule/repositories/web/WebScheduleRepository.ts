import { HTTPClient } from '../../../utils/HTTPClient';
import { ScheduleModel } from '../../models/ScheduleModel';
import { ScheduleRepository } from '../ScheduleRepository';
import { ScheduleSerializer } from '../../serializers/ScheduleSerializer';

export class WebScheduleRepository implements ScheduleRepository {
  private scheduleSerializer = new ScheduleSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<ScheduleModel[]> {
    const json = await this.client.getJSON('/api/schedules');
    return json.map((obj: any) => {
      return this.scheduleSerializer.deserialize(obj);
    });
  }
}
