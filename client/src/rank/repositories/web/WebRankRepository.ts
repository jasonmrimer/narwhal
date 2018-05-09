import { HTTPClient } from '../../../utils/HTTPClient';
import { RankRepository } from '../RankRepository';
import { RankSerializer } from '../../serialziers/RankSerializer';
import { RankModel } from '../../models/RankModel';

export class WebRankRepository implements RankRepository {
  private rankSerializer = new RankSerializer();

  constructor(private client: HTTPClient) {
  }

  async findAll(): Promise<RankModel[]> {
    const json = await this.client.getJSON('/api/ranks');
    return json.map((obj: any) => {
      return this.rankSerializer.deserialize(obj);
    });
  }
}
