import CertificationModel from '../models/CertificationModel';

export default class CertificationModelFactory {
  static build(id: number) {
    return new CertificationModel(id, `${id}`);
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}