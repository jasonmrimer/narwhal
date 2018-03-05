import { SidePanelStore, TabType } from './SidePanelStore';

describe('SidePanelStore', () => {
  it('should set the selected tab', () => {
    const subject = new SidePanelStore();
    subject.setSelectedTab(TabType.CURRENCY);
    expect(subject.selectedTab).toBe(TabType.CURRENCY);
  });
});