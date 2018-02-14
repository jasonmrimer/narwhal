import * as React from 'react';
import { Theme } from "../themes/default";
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import { EventModel, EventType} from "../event/models/EventModel";
import moment from "moment";
import DatePicker from '../widgets/DatePicker';
import FieldValidation from '../widgets/FieldValidation';
import {ThemeProvider} from "styled-components";
import RadioButtons from '../widgets/RadioButtons';
import TextInput from "../widgets/TextInput";
import TimeInput from "../widgets/TimeInput";
import StyledSkillsForm from "../skills/SkillsForm";
import SubmitButton from "../widgets/SubmitButton";
import DeleteButton from "../widgets/DeleteButton";
import { QualificationModel } from "../skills/models/QualificationModel";
import { AirmanQualificationModel } from "../airman/models/AirmanQualificationModel";
import TypeAheadInput from "../widgets/MultiSelect";
import { StyledEventForm } from '../event/EventForm';

const event = new EventModel('Pizza Party', '', moment(), moment(), 1, EventType.Appointment);
const failedEvent = new EventModel('', '', moment(), moment(), 1, EventType.Appointment, null, [{title: "This is required."}]);

const MONTH_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const wrapper = (story) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: theme.light, width: 400, height: '100%', padding: 16}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

export function FormStory() {
  storiesOf('EventForm', module)
    .addDecorator(story => wrapper(story))
    .add('new event', () => {
      return (
        <StyledEventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={null}
        />
      );
    })
    .add('editing an event', () => {
      return (
        <StyledEventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={event}/>
      );
    })
    .add('validation failed', () => {
      return (
        <StyledEventForm
          airmanId={1}
          handleSubmit={action('submmitted')}
          hideEventForm={action('hidden')}
          event={failedEvent}
        />
      );
    });

  storiesOf('SkillForm', module)
    .addDecorator(story => wrapper(story))
    .add('new skill', () => {
      return (
        <StyledSkillsForm
          airmanId={1}
          createAirmanQualification={action('created')}
          qualifications={[
            {id: 1, acronym: 'A', title: 'AAA'},
            {id: 2, acronym: 'B', title: 'BBB'},
            {id: 3, acronym: 'C', title: 'CCC'}
          ]}
        />
      )
    })
    .add('edit skill', () => {
      return (
        <StyledSkillsForm
          airmanId={1}
          createAirmanQualification={action('created')}
          qualifications={[
            {id: 1, acronym: 'A', title: 'AAA'},
            {id: 2, acronym: 'B', title: 'BBB'},
            {id: 3, acronym: 'C', title: 'CCC'}
          ]}
          skill={
            new AirmanQualificationModel(
              1,
              new QualificationModel(1, 'A', 'A'),
              moment.utc(),
              moment.utc()
            )
          }
        />
      );
    });

  storiesOf('DatePicker', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => <DatePicker onChange={action('input change')}/>)
    .add('with values', () => {
      return (
        <DatePicker
          dateValue={moment().format(MONTH_FORMAT)}
          onChange={action('input change')}
        />
      );
    })
    .add('disabled', () => {
      return (
        <DatePicker
          disabled={true}
          dateValue={moment().format(MONTH_FORMAT)}
          onChange={action('input change')}
        />
      );
    })
    .add('invalid value', () => {
      return (
        <FieldValidation
          name="dateThing"
          errors={[{dateThing: true}]}
        >
          <DatePicker
            dateValue={moment().format(MONTH_FORMAT)}
            onChange={action('input change')}
          />
        </FieldValidation>
      );
    });


  storiesOf('TimeInput', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => <TimeInput onChange={action('input change')}/>)
    .add('with values', () => {
      return (
        <TimeInput
          timeValue={moment().format(TIME_FORMAT)}
          onChange={action('input change')}
        />
      )
    });

  storiesOf('RadioButtons', module)
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

  storiesOf('TextInput', module)
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
    .add('invalid value', () => {
      return (
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
      );
    });

  storiesOf('StyledSelect', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (
        <TypeAheadInput
          selectHintOnEnter={true}
          onChange={action("CHANGED!!!")}
          options={[
            {value: "1", label: "banana"},
            {value: "2", label: "bagel"},
            {value: "3", label: "pretzel"},
            {value: "4", label: "donut"},
            {value: "5", label: "pizza"}]}
          placeholder="Favorite Food?"
        />
      )
    })
    .add('multi select', () => {
      return (
        <TypeAheadInput
          multiple
          selectHintOnEnter={true}
          onChange={action("CHANGED!!!")}
          options={[
            {value: "1", label: "banana"},
            {value: "2", label: "bagel"},
            {value: "3", label: "pretzel"},
            {value: "4", label: "donut"},
            {value: "5", label: "pizza"}]}
          placeholder="Favorite Food?"
        />
      )
    });

  storiesOf('SubmitButton', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (<SubmitButton text="CONFIRM"/>);
    });

  storiesOf('DeleteButton', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (<DeleteButton handleClick={action('delete clicked')}/>);
    });
};
