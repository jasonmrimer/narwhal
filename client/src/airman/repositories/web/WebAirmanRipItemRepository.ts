import { RipItemRepository } from '../AirmanRipItemRepository';
import { HTTPClient } from '../../../utils/HTTPClient';
import { AirmanRipItemSerializer } from '../../serializers/AirmanRipItemSerializer';
import { AirmanRipItemModel } from '../../models/AirmanRipItemModel';

export class WebRipItemRepository implements RipItemRepository {
  private airmanRipItemSerializer: AirmanRipItemSerializer = new AirmanRipItemSerializer();

  constructor(private client: HTTPClient) {
  }

  async findBySelectedAirman(id: number): Promise<AirmanRipItemModel[]> {
    const json = await this.client.getJSON(`/api/skill/rip-items?id=${id}`);
    return json.map((obj: any) => {
      return this.airmanRipItemSerializer.deserialize(obj);
    });
  }

  async updateAirmanRipItems(airmanRipItems: AirmanRipItemModel[]): Promise<AirmanRipItemModel[]> {
    const body = JSON.stringify(airmanRipItems);

    const json = await this.client.putJSON('/api/skill/rip-items', body);
    return json.map((obj: any) => {
      return this.airmanRipItemSerializer.deserialize(obj);
    });
  }
}