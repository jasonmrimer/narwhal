import { Serializer } from '../../utils/serializer';
import { AdminSiteModel } from '../models/AdminSiteModel';

export class AdminSiteItemSerializer implements Serializer<AdminSiteModel> {
  serialize(item: AdminSiteModel): {} {
    throw new Error('Not implemented');
  }

  deserialize(item: any): AdminSiteModel {
    return new AdminSiteModel(
      item.siteId,
      item.siteName
    );
  }
}