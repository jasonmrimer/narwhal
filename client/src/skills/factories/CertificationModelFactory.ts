import { CertificationModel } from '../models/CertificationModel';

export class CertificationModelFactory {
  static build(id: number) {
    return new CertificationModel(id, `${id}`);
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}