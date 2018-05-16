import { CertificationModel } from '../models/CertificationModel';

export class CertificationModelFactory {
  static build(id: number, siteId: number) {
    return new CertificationModel(id, `${id}`, siteId);
  }

  static buildList(amount: number, siteId: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i, siteId);
    });
  }
}