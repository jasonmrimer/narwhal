import * as React from 'react';
import '../index.css';
import {Theme} from '../themes/default';
import {FormStory} from './Form.stories';
import {NotificationStory} from './Notification.stories';
import {LeaveFormStory} from "./LeaveForm.stories";
import {IconStory} from "./Icon.stories";
import {ProfileStory} from "./Profile.stories";

document.body.style.fontFamily = Theme.fontFamily;
document.body.style.color = Theme.fontColor;
document.body.style.fontFamily = 'sans-serif';
document.body.style.fontWeight = '300';

FormStory();
NotificationStory();
LeaveFormStory();
IconStory();
ProfileStory();
