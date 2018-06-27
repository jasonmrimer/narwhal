import { action, computed, observable } from 'mobx';

export class Selectable<T> {
  @observable private _selected: boolean = false;
  @observable private _model: T;

  static transform<U>(values: U[]) {
    return values.map(v => new Selectable<U>(v));
  }

  constructor(model: T) {
    this._model = model;
  }

  @computed
  get selected() {
    return this._selected;
  }

  @computed
  get model() {
    return this._model;
  }

  @action.bound
  setSelected(value: boolean) {
    this._selected = value;
  }

  @action.bound
  setModel(value: T) {
    this._model = value;
  }
}