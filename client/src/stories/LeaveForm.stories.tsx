import * as React from 'react';
import { Theme } from '../themes/default';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { StyledLeaveForm } from '../event/LeaveForm';
import { LeaveFormStore } from '../event/stores/LeaveFormStore';
import { EventModelFactory } from '../event/factories/EventModelFactory';

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

/*tslint:disable:no-empty*/
const eventActions = {
  addEvent: () => {
  },
  removeEvent: () => {
  }
};

export function LeaveFormStory() {
  storiesOf('LeaveForm', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (
        <StyledLeaveForm
          airmanId={1}
          leaveFormStore={new LeaveFormStore(eventActions)}
        />
      );
    })
    .add('edit', () => {
      const store = new LeaveFormStore(eventActions);
      store.open(EventModelFactory.build());
      return (
        <StyledLeaveForm
          airmanId={1}
          leaveFormStore={store}
        />
      );
    });
}