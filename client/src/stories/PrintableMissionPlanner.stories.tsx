import * as React from 'react';
import { Theme } from '../themes/default';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { CrewModelFactory } from '../crew/factories/CrewModelFactory';
import { StyledPrintableMissionPlanner } from '../crew/PrintableMissionPlanner';

const wrapper = (story: any) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: 'white', width: '11in', height: '8.5in', padding: 0}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

const crew = CrewModelFactory.build();

export function PrintableMissionPlannerStory() {
  storiesOf('PrintableMissionPlanner', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (
        <StyledPrintableMissionPlanner visible={true} crew={crew}/>
      );
    });
}