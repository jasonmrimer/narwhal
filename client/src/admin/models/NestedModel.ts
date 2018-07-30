import { computed, observable } from 'mobx';

export class NestedModel<T, U> {
  @observable private _parent: T;
  @observable private _children: U[] = [];

  public constructor(parent: T, children: U[] = []) {
    this._parent = parent;
    this._children = children;
  }

  @computed
  get parent() {
    return this._parent;
  }

  @computed
  get children() {
    return this._children;
  }
}