import { HierarchySelectionStore } from './HierarchySelectionStore';
import { HierarchySelectionModel } from '../../airman/models/HierarchySelectionModel';

describe('HierarchySelectionStore', () => {
  let subject: HierarchySelectionStore;
  let parent: HierarchySelectionModel;
  const currentChildren = [1, 2, 3, 4, 5];

  beforeEach(() => {
    subject = new HierarchySelectionStore();
    parent = subject.findParent(14);

    subject.addChild(parent, 1);
  });

  it('should find a parent', () => {
    expect(subject.findParent(14)!.parentId).toBe(14);
  });

  it('should add a child', () => {
    expect(parent.childIds).toContain(1);
  });

  it('should add children', () => {
    subject.addChildren(14, currentChildren);
    expect(parent.childIds.length).toBe(5);
    expect(parent.childIds).toContain(1);
    expect(parent.childIds).toContain(2);
    expect(parent.childIds).toContain(3);
    expect(parent.childIds).toContain(4);
    expect(parent.childIds).toContain(5);
  });

  it('should clear all children from HierarchySelectionModel', () => {
    subject.clearParent(14);
    expect(subject.parents.find(p => p.parentId === 14)).toBe(undefined);
  });

  it('should add all children if portion exists in childIds', () => {
    subject.addChildren = jest.fn();
    subject.toggleParent(14, currentChildren);
    expect(subject.addChildren).toHaveBeenCalledWith(14, currentChildren);
  });

  it('should add all children if none exist in childIds', () => {
    subject.clearParent(14);
    subject.addChildren = jest.fn();
    subject.toggleParent(14, currentChildren);
    expect(subject.addChildren).toHaveBeenCalledWith(14, currentChildren);
  });

  it('should clear all children if all exist in childIds', () => {
    subject.addChildren(14, currentChildren);
    subject.clearParent = jest.fn();
    subject.toggleParent(14, currentChildren);
    expect(subject.clearParent).toHaveBeenCalledWith(14);
  });

  it('should tell us if parent is selected', () => {
    expect(subject.isParentSelected(14, [1])).toBeTruthy();
  });

  it('should tell us if parent is not selected', () => {
    expect(subject.isParentSelected(14, currentChildren)).toBeFalsy();
  });

  it('should tell us if a child is selected', () => {
    const result = subject.isChildSelected(parent, 1);
    expect(result).toBeTruthy();
  });

  it('should tell us if a child is not selected', () => {
    const result2 = subject.isChildSelected(parent, 112);
    expect(result2).toBeFalsy();
  });

  it('should remove a child', () => {
    subject.addChildren(14, currentChildren);
    subject.removeChild(parent, 1);
    expect(parent.childIds.length).toBe(4);
    expect(parent.childIds).toContain(2);
    expect(parent.childIds).toContain(3);
    expect(parent.childIds).toContain(4);
    expect(parent.childIds).toContain(5);
  });

  it('should select child', () => {
    subject.addChild = jest.fn();
    subject.toggleChild(parent, 12);
    expect(subject.addChild).toHaveBeenCalledWith(parent, 12);
  });

  it('should deselect child', () => {
    subject.removeChild = jest.fn();
    subject.toggleChild(parent, 1);
    expect(subject.removeChild).toHaveBeenCalledWith(parent, 1);
  });
});