import * as React from 'react';
import theme from "../themes/default";
import EventForm from "../tracker/SidePanel/EventForm";
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import EventModel, {EventType} from "../event/EventModel";
import moment from "moment";
import DatePicker from '../widgets/DatePicker';
import FieldValidation from '../widgets/FieldValidation';
import {ThemeProvider} from "styled-components";
import RadioButtons from '../widgets/RadioButtons';
import TextInput from "../widgets/TextInput";

const event = new EventModel('Pizza Party', '', moment(), moment(), 1, EventType.Appointment);
const failedEvent = new EventModel('', '', moment(), moment(), 1, EventType.Appointment, null, [{title: "This is required."}]);

const MONTH_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const wrapper = (story) => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{backgroundColor: theme.light, width: 400, height: '100%', padding: 16}}>
        {story()}
      </div>
    </ThemeProvider>
  );
}

export function EventFormStory() {
  storiesOf('EventForm', module)
    .addDecorator(story => wrapper(story))
    .add('new event', () => {
      return (
        <EventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={null}
        />
      );
    })
    .add('editing an event', () => {
      return (
        <EventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={event}/>
      );
    })
    .add('validation failed', () => {
      return (
        <EventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={failedEvent}
        />
      );
    });

  storiesOf('EventForm/DatePicker', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => <DatePicker onChange={action('input change')}/>)
    .add('with values', () => {
      return (
        <DatePicker
          dateValue={moment().format(MONTH_FORMAT)}
          timeValue={moment().format(TIME_FORMAT)}
          onChange={action('input change')}
        />
      );
    });

  storiesOf('EventForm/FieldValidation', module)
    .addDecorator(story => wrapper(story))
    .add('invalid date and text', () => {
      return (
        <div>
          <FieldValidation
            name="dateThing"
            errors={[{dateThing: true}]}
          >
            <DatePicker
              dateValue={moment().format(MONTH_FORMAT)}
              timeValue={moment().format(TIME_FORMAT)}
              onChange={action('input change')}
            />
          </FieldValidation>
          <FieldValidation
            name="textThing"
            errors={[{textThing: true}]}
          >
            <TextInput
              placeholder="Title"
              value={'Here is my spout'}
              name="title"
              onChange={action('input change')}
            />
          </FieldValidation>
        </div>
      );
    });

  storiesOf('EventForm/RadioButtons', module)
    .addDecorator(story => wrapper(story))
    .add('with value selected', () => {
      return (
        <RadioButtons
          options={['Hamburger', 'Hot Dog', 'Pizza']}
          value={'Pizza'}
          onChange={action('input change')}
        />
      );
    });

  storiesOf('EventForm/TextInput', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => {
      return (
        <TextInput
          placeholder="Title"
          value={''}
          name="title"
          onChange={action('input change')}
        />
      )
    })
    .add('with values', () => {
      return (
        <TextInput
          placeholder="Title"
          value={'Here is my handle'}
          name="title"
          onChange={action('input change')}
        />
      )
    })
}


