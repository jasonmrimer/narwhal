import { action, computed, observable } from 'mobx';

export class SidePanelStore {
  @observable private _selectedTab: TabType;

  @action.bound
  setSelectedTab(tab: TabType) {
    this._selectedTab = tab;
  }

  @computed
  get selectedTab() {
    return this._selectedTab;
  }
}

export enum TabType {
  CURRENCY,
  AVAILABILITY
}