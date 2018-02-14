import * as React from 'react';
import { Theme } from "../themes/default";
import {storiesOf} from '@storybook/react';
import {ThemeProvider} from "styled-components";
import Notification from "../widgets/Notification";

const wrapper = (story) => {
    return (
        <ThemeProvider theme={Theme}>
            <div style={{backgroundColor: theme.light, width: 400, height: '100%', padding: 16}}>
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
                <Notification>
                    No members at this location match your search.
                </Notification>
            );
        });
}