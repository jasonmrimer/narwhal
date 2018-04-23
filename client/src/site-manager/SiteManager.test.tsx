import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { SiteManager } from './SiteManager';
import { DoubleRepositories } from '../utils/Repositories';
import { SiteManagerStore } from './stores/SiteManagerStore';

describe('SiteManager', () => {
  let subject: ReactWrapper;
  let siteManagerStore: SiteManagerStore;
  let hydrateSpy = jest.fn();

  beforeEach(async () => {
    siteManagerStore = new SiteManagerStore(DoubleRepositories);
    await siteManagerStore.hydrate();

    subject = mount(
      <SiteManager
        siteManagerStore={siteManagerStore}
      />
    );
  });


  it('should render user\'s site name in the header', () => {
    expect(subject.find('h2').text()).toBe(`${siteManagerStore.siteName} Personnel`);
  });

  it('should shows a header above the list of airmen', () => {
    let headers = subject.find('.airmen-header');
    expect(headers.at(0).text()).toBe('NAME');
  });

  it('should list of airmen from the profile\'s site', () => {
    expect(subject.find('.airman-row').length).toBe(10);
  });

  it('should hydrate the site manager store on mount', async () => {
    siteManagerStore.hydrate = hydrateSpy;

    await (subject.instance() as SiteManager).componentDidMount();
    expect(siteManagerStore.hydrate).toHaveBeenCalled();
  });
});