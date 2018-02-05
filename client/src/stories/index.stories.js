import * as React from 'react';
import theme from '../themes/default';
import '../index.css';
import {FormStory} from "./Form.stories";

document.body.style.fontFamily = theme.fontFamily;
document.body.style.color = theme.fontColor;
document.body.style.fontFamily = 'sans-serif';
document.body.style.fontWeight = 300;

FormStory()