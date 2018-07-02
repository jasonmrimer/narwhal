import { HierarchySelectionStore } from './HierarchySelectionStore';
import { Selectable } from '../models/Selectable';

describe('HierarchySelectionStore', () => {
  let subject: HierarchySelectionStore<number>;
  let currentChildren: Selectable<number>[];

  beforeEach(() => {
    subject = new HierarchySelectionStore();
    currentChildren = Selectable.transform([1, 2, 3, 4, 5]);
  });

  it('isParentSelected should be false by default', () => {
    expect(subject.areSelected(currentChildren)).toBeFalsy();
  });

  it('isParentSelected should be false for partial selections', () => {
    currentChildren[0].setSelected(true);
    currentChildren[2].setSelected(true);
    expect(subject.areSelected(currentChildren)).toBeFalsy();
  });

  it('isParentSelected should be false for full selection', () => {
    currentChildren[0].setSelected(true);
    currentChildren[1].setSelected(true);
    currentChildren[2].setSelected(true);
    currentChildren[3].setSelected(true);
    currentChildren[4].setSelected(true);
    expect(subject.areSelected(currentChildren)).toBeTruthy();
  });

  it('should set all children to true', () => {
    subject.toggleAll(currentChildren);
    expect(subject.areSelected(currentChildren)).toBeTruthy();
  });

  it('should set all children to false', () => {
    subject.toggleAll(currentChildren);
    subject.toggleAll(currentChildren);
    expect(subject.areSelected(currentChildren)).toBeFalsy();
  });
});