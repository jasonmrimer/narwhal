import { HierarchySelectionModel } from '../../airman/models/HierarchySelectionModel';
import { action, observable } from 'mobx';

export class HierarchySelectionStore {
  parents: HierarchySelectionModel[] = [];

  @action.bound
  findParent(id: number) {
    let parent = this.parents.find(p => p.parentId === id);
    if (parent === undefined) {
      parent = new HierarchySelectionModel(id);
      this.parents.push(parent);
    }
    return parent;
  }

  @action.bound
  addChild(parent: HierarchySelectionModel, childId: number) {
    if (parent.childIds.find(c => c === childId) === undefined) {
      parent.childIds.push(childId);
    }
  }

  @action.bound
  addChildren(parentId: number, childrenIds: number[]) {
    const parent = this.findParent(parentId);
    childrenIds.forEach(c => this.addChild(parent, c));
  }

  @action.bound
  removeChild(parent: HierarchySelectionModel, childId: number) {
    this.removeItem(childId, parent.childIds);
  }

  @action.bound
  removeItem(item: any, array: any[]) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  @action.bound
  clearParent(id: number) {
    this.removeItem(this.findParent(id), this.parents);
  }

  @observable
  isChildSelected(parent: HierarchySelectionModel, id: number) {
    const result = parent.childIds.find(c => c === id) !== undefined;
    console.log(result);
    return result;
  }

  @observable
  isParentSelected(id: number, childrenIds: number[]) {
    const parent = this.findParent(id);

    const result = childrenIds.map(
      c => parent.childIds.find(c2 => c === c2) !== undefined
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
    console.log(this.isChildSelected(parent, id))
    if (this.isChildSelected(parent, id)) {
      this.removeChild(parent, id);
    } else {
      this.addChild(parent, id);
    }
  }
}