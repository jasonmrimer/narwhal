import * as React from 'react';
import { Theme } from '../themes/default';
import { ThemeProvider } from 'styled-components';
import { storiesOf } from '@storybook/react';
import { StyledProfileSitePicker } from '../profile/ProfileSitePicker';
import { ProfileSitePickerStore } from '../profile/stores/ProfileSitePickerStore';
import { DoubleRepositories } from '../Repositories';
import { SiteModel, SiteType } from '../site/models/SiteModel';

const wrapper = (story: any) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: Theme.light, width: '100%', height: '100%'}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

export function ProfileStory() {
  storiesOf('Profiles', module)
    .addDecorator(story => wrapper(story))
    .add('StyledProfileSitePicker', () => {
      const store = new ProfileSitePickerStore(DoubleRepositories);
      store.getSiteByName = (name: string) => {
        return new SiteModel(1, 'A', [], SiteType.DGSCoreSite, 'A');
      }
      return (
        <StyledProfileSitePicker
          profileStore={store}
        />
      );
    });
}