import {action, computed, observable} from "mobx";

export class HierarchySelectionModel {
  @observable private _childIds: number[] = [];

  constructor(public parentId: number) {}

  @computed
  get childIds() {
    return this._childIds;
  }

  @action.bound
  addChild(childId: number) {
    this._childIds.push(childId);
  }

  @action.bound
  removeChild(item: any) {
    const index = this._childIds.indexOf(item);
    if (index !== -1) {
      this._childIds.splice(index, 1);
    }
  }

  @action.bound
  isChild(id: number) {
    return this._childIds.find(child => child === id) !== undefined;
  }
}