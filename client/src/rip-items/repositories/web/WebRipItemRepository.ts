import { RipItemRepository } from '../RipItemRepository';
import { RipItemModel } from '../../models/RipItemModel';
import { HTTPClient } from '../../../HTTPClient';

export class WebRipItemRepository implements RipItemRepository {

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<RipItemModel[]> {
    const json = await this.client.getJSON('/api/skills/rip-items');
    return json.map((obj: any) => {
      return new RipItemModel(obj.id, obj.title);
    });
  }

}