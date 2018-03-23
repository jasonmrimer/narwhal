import * as React from 'react';
import { Theme } from '../themes/default';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { StyledSubmitButton } from '../widgets/SubmitButton';
import { StyledButton } from '../widgets/Button';
import { action } from '@storybook/addon-actions';
import { StyledSingleTypeahead } from '../widgets/SingleTypeahead';
import { StyledTextInput } from '../widgets/TextInput';
import { StyledFieldValidation } from '../widgets/FieldValidation';
import { StyledRadioButtons } from '../widgets/RadioButtons';
import { StyledTimeInput } from '../widgets/TimeInput';
import { StyledDatePicker } from '../widgets/DatePicker';
import { StyledMultiTypeahead } from '../widgets/MultiTypeahead';
import { DeleteIcon } from '../icons/DeleteIcon';
import { StyledSkillsForm } from '../skills/SkillsForm';
import { SkillFormStore } from '../skills/stores/SkillFormStore';
import { SkillType } from '../skills/models/SkillType';
import * as moment from 'moment';

const wrapper = (story: any) => {
  return (
    <ThemeProvider theme={Theme}>
      <div style={{backgroundColor: Theme.light, width: 400, height: '100%', padding: 16}}>
        {story()}
      </div>
    </ThemeProvider>
  );
};

const skillsActions = {
  /* tslint:disable:no-empty */
  addSkill: () => {
  },
  removeSkill: () => {
  },
  siteId: 1
};

export function FormStory() {
  storiesOf('SkillForm', module)
    .addDecorator(story => wrapper(story))
    .add('new skill', () => {
      return (
        <StyledSkillsForm
          airmanId={1}
          skillFormStore={new SkillFormStore(skillsActions)}
        />
      );
    })
    .add('edit skill', () => {
      const store = new SkillFormStore(skillsActions);
      store.open({
        id: 1, type: SkillType.Qualification, skillId: 1, airmanId: 1, earnDate: moment(), expirationDate: moment()
      });
      return (
        <StyledSkillsForm
          airmanId={1}
          skillFormStore={store}
        />
      );
    });

  storiesOf('StyledDatePicker', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => {
      return (
        <StyledDatePicker
          name="date-picker"
          value=""
          onChange={action('input change')}
        />
      );
    })
    .add('with values', () => {
      return (
        <StyledDatePicker
          name="date-picker"
          value="2018-12-25"
          onChange={action('input change')}
        />
      );
    })
    .add('disabled', () => {
      return (
        <StyledDatePicker
          disabled={true}
          name="date-picker"
          value="2018-12-25"
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
            name="date-picker"
            value=""
            onChange={action('input change')}
          />
        </StyledFieldValidation>
      );
    });

  storiesOf('StyledTimeInput', module)
    .addDecorator(story => wrapper(story))
    .add('empty', () => {
      return (
        <StyledTimeInput
          name="time-picker"
          value=""
          onChange={action('input change')}
        />
      );
    })
    .add('with values', () => {
      return (
        <StyledTimeInput
          name="time-picker"
          value="2359"
          onChange={action('input change')}
        />
      );
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
      );
    })
    .add('with values', () => {
      return (
        <StyledTextInput
          placeholder="Title"
          value={'Here is my handle'}
          name="title"
          onChange={action('input change')}
        />
      );
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

  storiesOf('StyledSingleTypeahead', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (
        <StyledSingleTypeahead
          onChange={action('changed')}
          options={[
            {value: '1', label: 'banana'},
            {value: '2', label: 'bagel'},
            {value: '3', label: 'pretzel'},
            {value: '4', label: 'donut'},
            {value: '5', label: 'pizza'}]}
          placeholder="Favorite Food?"
        />
      );
    });

  storiesOf('StyledMultiTypeahead', module)
    .addDecorator(story => wrapper(story))
    .add('multi select', () => {
      return (
        <StyledMultiTypeahead
          onChange={action('CHANGED!!!')}
          options={[
            {value: '1', label: 'banana'},
            {value: '2', label: 'bagel'},
            {value: '3', label: 'pretzel'},
            {value: '4', label: 'donut'},
            {value: '5', label: 'pizza'}]}
          placeholder="Favorite Food?"
        />
      );
    });

  storiesOf('StyledSubmitButton', module)
    .addDecorator(story => wrapper(story))
    .add('default', () => {
      return (<StyledSubmitButton text="CONFIRM"/>);
    });

  storiesOf('StyledButton', module)
    .addDecorator(story => wrapper(story))
    .add('simple', () => {
      return (
        <StyledButton
          text="TEXT"
          onClick={action('clicked')}
        />
      );
    })
    .add('delete', () => {
      return (
        <StyledButton
          text="DELETE"
          onClick={action('DELETE clicked')}
          renderIcon={() => <DeleteIcon/>}
        />
      );
    });

  // storiesOf('SVGDropdown', module)
  //   .addDecorator(story => wrapper(story))
  //   .add('shift', () => {
  //     return (
  //       <ShiftDropdown trackerStore={}/>
  //     );
  //   });
}
