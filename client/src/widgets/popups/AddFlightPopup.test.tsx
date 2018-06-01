import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { AddFlightPopup } from './AddFlightPopup';
import { StyledPopupModal } from './PopupModal';
import { StyledTextInput } from '../inputs/TextInput';

describe('AddFlightPopup', () => {
  let subject: ShallowWrapper;
  let siteManagerStore: any;

  beforeEach(() => {
    siteManagerStore = {
      cancelAddFlight: jest.fn(),
      saveNewFlight: jest.fn(),
    }

    subject = shallow(
      <AddFlightPopup
        siteManagerStore={siteManagerStore}
      />
    )
  });

  it('should be titled Add Flight', () => {
    expect(subject.find(StyledPopupModal).prop('title')).toBe('Add Flight');
  });

  it('should render an input for the flight name', () => {
    expect(subject.find(StyledTextInput).exists()).toBeTruthy();
  });

  it('should save a new flight when confirm is clicked', () => {
    expect(subject.find(StyledPopupModal).prop('onConfirm')).toBe(siteManagerStore.saveNewFlight);
  });

  it('should cancel adding a flight when the cancel button is clicked', () => {
    expect(subject.find(StyledPopupModal).prop('onCancel')).toBe(siteManagerStore.cancelAddFlight);
  });
});