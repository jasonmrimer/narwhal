import * as React from 'react';
import { Theme } from '../themes/default';
import '../index.css';
import { FormStory } from './Form.stories';
import { NotificationStory } from './Notification.stories';

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.color = Theme.fontColor;
document.body.style.fontFamily = 'sans-serif';
document.body.style.fontWeight = '300';

FormStory();
NotificationStory();
