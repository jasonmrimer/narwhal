import * as React from 'react';
import { Theme } from '../themes/default';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { StyledNotification } from '../widgets/Notification';

/*tslint:disable:no-any*/
const wrapper = (story: any) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: Theme.light, width: 400, height: '100%', padding: 16}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

export function NotificationStory() {
  storiesOf('Notification', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (
        <StyledNotification>
          No members at this location match your search.
        </StyledNotification>
      );
    });
}