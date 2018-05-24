import * as React from 'react';
import { CertificationForm } from './CertificationForm';
import { CertificationFormStore } from './stores/CertificationFormStore';
import { DoubleRepositories } from '../../utils/Repositories';
import { CertificationModelFactory } from './factories/CertificationModelFactory';
import { shallow, ShallowWrapper } from 'enzyme';
import { CertificationModel } from './models/CertificationModel';
import { StyledTextInput } from '../../widgets/inputs/TextInput';
import { StyledSubmitButton } from '../../widgets/forms/SubmitButton';
import { StyledForm } from '../../widgets/forms/Form';
import { eventStub } from '../../utils/testUtils';
import { StyledNavigationBackButton } from '../../widgets/buttons/NavigationBackButton';
import { StyledFieldValidation } from '../../widgets/inputs/FieldValidation';
import { ConfirmationPopup, StyledConfirmationPopup } from '../../widgets/ConfirmationPopup';

describe('CertificationForm', () => {
  let subject: ShallowWrapper;
  let certification: CertificationModel;
  let store: CertificationFormStore;
  const certificationActions: any = {
    submit: jest.fn(),
    setPendingDelete: jest.fn(),
    dismissPendingDelete: jest.fn(),
    deleteCertification: jest.fn(),
  };

  const profileStore: any = {
    profile: {
      siteName: 'Hiya!'
    }
  };

  beforeEach(() => {
    certification = CertificationModelFactory.build(1, 1);
    DoubleRepositories.certificationRepository.update = jest.fn();

    store = new CertificationFormStore();

    store.hydrate(certification);

    subject = shallow(
      <CertificationForm
        certificationFormStore={store}
        certificationActions={certificationActions}
        profileStore={profileStore}
      />
    );
  });

  it('should render the certification title', () => {
    expect(subject.find('h2').text()).toContain(certification.title);
  });

  it('should render a acronym input', () => {
    expect(subject.find(StyledTextInput).prop('value')).toBe(certification.title);
  });

  it('should call the certificationFormStore set acronym method', () => {
    subject.find(StyledTextInput).simulate('change', {target: {value: 'new title'}});
    expect(store.certification.title).toBe('NEW TITLE');
  });

  it('should render a save button', () => {
    expect(subject.find(StyledSubmitButton).exists()).toBeTruthy();
  });

  it('should call the certificationFormStore update method on submit', async () => {
    await subject.find(StyledForm).simulate('submit', eventStub);
    expect(certificationActions.submit).toHaveBeenCalled();
  });

  it('should render a button to go back', () => {
    expect(subject.find(StyledNavigationBackButton).exists()).toBeTruthy();
  });

  it('should render with field validation', () => {
    expect(subject.find(StyledFieldValidation).prop('fieldName')).toBe('title');
  });

  it('should render a setPendingDelete button', () => {
    expect(subject.find('.delete').text()).toContain('DELETE');
  });

  it('should call the setPendingDelete action with the certification id', () => {
    subject.find('.delete').simulate('click');
    expect(certificationActions.setPendingDelete).toHaveBeenCalled();
  });

  it('should render a popup if there is a pending delete', () => {
    expect(subject.find(ConfirmationPopup).exists()).toBeFalsy();
    store.setPendingDelete(true);
    subject.update();
    expect(subject.find(StyledConfirmationPopup).exists()).toBeTruthy();
  });

  it('should pass the correct props to ConfirmationPopup', () => {
    store.setPendingDelete(true);
    subject.update();
    const confirmationPopup = subject.find(StyledConfirmationPopup);

    expect(confirmationPopup.prop('title')).toBe(certification.title);
    expect(confirmationPopup.prop('siteName')).toBe('Hiya!');
    expect(confirmationPopup.prop('onCancel')).toBe(certificationActions.dismissPendingDelete);
    expect(confirmationPopup.prop('onConfirm')).toBeDefined();
  });

});