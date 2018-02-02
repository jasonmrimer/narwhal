import QualificationModel from '../models/QualificationModel';

export default class QualificationModelFactory {
  static build(id: number) {
    return new QualificationModel(id, `${id}`, `${id}`);
  }

  static buildList(amount: number) {
    return Array(amount).fill(null).map((_, i) => {
      return this.build(i);
    });
  }
}