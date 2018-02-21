import * as React from 'react';
import { Theme } from "../themes/default";
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { EventModel, EventType } from "../event/models/EventModel";
import moment from "moment";
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { ThemeProvider } from "styled-components";
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledTextInput } from "../widgets/TextInput";
import { StyledTimeInput } from "../widgets/TimeInput";
import { StyledSkillsForm } from "../skills/SkillsForm";
import { StyledSubmitButton } from "../widgets/SubmitButton";
import { StyledDeleteButton } from "../widgets/DeleteButton";
import { QualificationModel } from "../skills/models/QualificationModel";
import { AirmanQualificationModel } from "../airman/models/AirmanQualificationModel";
import { StyledMultiSelect } from "../widgets/MultiSelect";
import { StyledEventForm } from '../event/EventForm';

const event = new EventModel('Pizza Party', '', moment(), moment(), 1, EventType.Appointment);
const failedEvent = new EventModel('', '', moment(), moment(), 1, EventType.Appointment, null, [{title: "This is required."}]);

const MONTH_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const wrapper = (story) => {
    return (
        <ThemeProvider theme={Theme}>
            <div style={{backgroundColor: Theme.light, width: 400, height: '100%', padding: 16}}>
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
                            moment(),
                            moment()
                        )
                    }
                />
            );
        });

    storiesOf('StyledDatePicker', module)
        .addDecorator(story => wrapper(story))
        .add('empty', () => <StyledDatePicker onChange={action('input change')}/>)
        .add('with values', () => {
            return (
                <StyledDatePicker
                    dateValue={moment().format(MONTH_FORMAT)}
                    onChange={action('input change')}
                />
            );
        })
        .add('disabled', () => {
            return (
                <StyledDatePicker
                    disabled={true}
                    dateValue={moment().format(MONTH_FORMAT)}
                    onChange={action('input change')}
                />
            );
        })
        .add('invalid value', () => {
            return (
                <StyledFieldValidation
                    name="dateThing"
                    errors={[{dateThing: true}]}
                >
                    <StyledDatePicker
                        dateValue={moment().format(MONTH_FORMAT)}
                        onChange={action('input change')}
                    />
                </StyledFieldValidation>
            );
        });


    storiesOf('StyledTimeInput', module)
        .addDecorator(story => wrapper(story))
        .add('empty', () => <StyledTimeInput onChange={action('input change')}/>)
        .add('with values', () => {
            return (
                <StyledTimeInput
                    timeValue={moment().format(TIME_FORMAT)}
                    onChange={action('input change')}
                />
            )
        });

    storiesOf('StyledRadioButtons', module)
        .addDecorator(story => wrapper(story))
        .add('with value selected', () => {
            return (
                <StyledRadioButtons
                    options={['Hamburger', 'Hot Dog', 'Pizza']}
                    value={'Pizza'}
                    onChange={action('input change')}
                />
            );
        });

    storiesOf('StyledTextInput', module)
        .addDecorator(story => wrapper(story))
        .add('empty', () => {
            return (
                <StyledTextInput
                    placeholder="Title"
                    value={''}
                    name="title"
                    onChange={action('input change')}
                />
            )
        })
        .add('with values', () => {
            return (
                <StyledTextInput
                    placeholder="Title"
                    value={'Here is my handle'}
                    name="title"
                    onChange={action('input change')}
                />
            )
        })
        .add('invalid value', () => {
            return (
                <StyledFieldValidation
                    name="textThing"
                    errors={[{textThing: true}]}
                >
                    <StyledTextInput
                        placeholder="Title"
                        value={'Here is my spout'}
                        name="title"
                        onChange={action('input change')}
                    />
                </StyledFieldValidation>
            );
        });

    storiesOf('StyledMultiSelect', module)
        .addDecorator(story => wrapper(story))
        .add('default', () => {
            return (
                <StyledMultiSelect
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
                <StyledMultiSelect
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

    storiesOf('StyledSubmitButton', module)
        .addDecorator(story => wrapper(story))
        .add('default', () => {
            return (<StyledSubmitButton text="CONFIRM"/>);
        });

    storiesOf('StyledDeleteButton', module)
        .addDecorator(story => wrapper(story))
        .add('default', () => {
            return (<StyledDeleteButton handleClick={action('delete clicked')}/>);
        });
};
