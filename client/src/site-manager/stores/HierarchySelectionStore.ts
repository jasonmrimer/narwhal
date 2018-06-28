import {HierarchySelectionModel} from '../../airman/models/HierarchySelectionModel';
import {action, computed, observable} from 'mobx';

export class HierarchySelectionStore {
  @observable _parents: HierarchySelectionModel[] = [];

  @computed
  get parents() {
    return this._parents;
  }

  @action.bound
  findParent(id: number) {
    let parent = this._parents.find(p => p.parentId === id);
    if (parent === undefined) {
      parent = new HierarchySelectionModel(id);
      this._parents.push(parent);
    }
    return parent;
  }

  @action.bound
  parentPosition(parent: HierarchySelectionModel) {
    return this._parents.indexOf(parent);
  }

  @action.bound
  addChild(parent: HierarchySelectionModel, childId: number) {
    const chickenParent = this.findParent(parent.parentId);
    const parentIndex = this.parentPosition(chickenParent);

    if (!this._parents[parentIndex].isChild(childId)) {
      this._parents[parentIndex].addChild(childId);
    }
  }

  @action.bound
  addChildren(parentId: number, childrenIds: number[]) {
    const parent = this.findParent(parentId);
    childrenIds.forEach(c => this.addChild(parent, c));
  }

  @action.bound
  removeChild(parent: HierarchySelectionModel, childId: number) {
    const parentIndex = this.parentPosition(parent);
    this._parents[parentIndex].removeChild(childId);
  }

  @action.bound
  clearParent(id: number) {
    const index = this._parents.indexOf(this.findParent(id));
    if (index !== -1) {
      this._parents.splice(index, 1);
    }
  }

  @action.bound
  isChildSelected(parent: HierarchySelectionModel, childId: number) {
    const parentIndex = this.parentPosition(parent);
    return this._parents[parentIndex].isChild(childId);
  }

  @action.bound
  isParentSelected(id: number, childrenIds: number[]) {
    const parent = this.findParent(id);
    const parentIndex = this.parentPosition(parent);

    const result = childrenIds.map(
      c => this._parents[parentIndex].isChild(c)
    );

    return result.find(r => r === false) === undefined;
  }

  @action.bound
  toggleParent(id: number, childrenIds: number[]) {
    if (this.isParentSelected(id, childrenIds)) {
      this.clearParent(id);
    } else {
      this.addChildren(id, childrenIds);
    }
  }

  @action.bound
  toggleChild(parent: HierarchySelectionModel, id: number) {
    const parentIndex = this.parentPosition(parent);

    if (this._parents[parentIndex].isChild(id)) {
      this.removeChild(parent, id);
    } else {
      this.addChild(parent, id);
    }
  }
}