import * as React from 'react';
import { Theme } from '../themes/default';
import { ThemeProvider } from 'styled-components';
import { NightShiftIcon } from '../icons/NightShiftIcon';
import { SwingShiftIcon } from '../icons/SwingShiftIcon';
import { DayShiftIcon } from '../icons/DayShiftIcon';
import { storiesOf } from '@storybook/react';

const wrapper = (story: any) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: Theme.light, width: 400, height: '100%', padding: 16}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

export function IconStory() {
  storiesOf('Icons', module)
    .addDecorator(story => wrapper(story))
    .add('day', () => <DayShiftIcon/>)
    .add('swing', () => <SwingShiftIcon/>)
    .add('night', () => <NightShiftIcon/>);
}