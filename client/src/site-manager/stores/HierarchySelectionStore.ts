import { action } from 'mobx';
import { Selectable } from '../models/Selectable';

export class HierarchySelectionStore<T>  {

  areSelected(children: Selectable<T>[]) {
    return children.find(r => !r.selected) === undefined;
  }

  @action.bound
  toggleAll(children: Selectable<T>[]) {
    if (this.areSelected(children)) {
      children.forEach(c => c.setSelected(false));
    } else {
      children.forEach(c => c.setSelected(true));
    }
  }

  getSelections(children: Selectable<T>[]) {
    const selected = children.filter(c => c.selected);
    const length =  selected.length;
    return length === 0 || length === children.length ? children : selected;
  }
}