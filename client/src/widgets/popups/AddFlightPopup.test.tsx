import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { AddFlightPopup } from './AddFlightPopup';
import { StyledPopupModal } from './PopupModal';
import { StyledTextInput } from '../inputs/TextInput';
import { FlightModel } from '../../flight/model/FlightModel';
import { Button } from '../buttons/Button';

describe('AddFlightPopup', () => {
  let subject: ReactWrapper;
  let siteManagerStore: any;

  beforeEach(() => {
    siteManagerStore = {
      cancelPendingNewFlight: jest.fn(),
      savePendingNewFlight: jest.fn(),
      setPendingFlightName: jest.fn(),
      pendingNewFlight: new FlightModel(1, '', 1)
    };

    subject = mount(
      <AddFlightPopup
        siteManagerStore={siteManagerStore}
      />
    );
  });

  it('should be titled Add Flight', () => {
    expect(subject.find(StyledPopupModal).prop('title')).toBe('Add Flight');
  });

  it('should render an input for the flight name', () => {
    expect(subject.find(StyledTextInput).prop('value')).toBe(siteManagerStore.pendingNewFlight.name);
  });

  it('should save a new flight when confirm is clicked', () => {
    subject.find(StyledPopupModal).find(Button).at(1).simulate('click');
    expect(siteManagerStore.savePendingNewFlight).toHaveBeenCalled();
  });

  it('should cancel adding a flight when the cancel button is clicked', () => {
    subject.find(StyledPopupModal).find(Button).at(0).simulate('click');
    expect(siteManagerStore.cancelPendingNewFlight).toHaveBeenCalled();
  });

  it('should set the name of the flight on changing the name input', () => {
    subject.find(StyledTextInput).simulate('change', {target: {value: 'flight name'}});
    expect(siteManagerStore.setPendingFlightName).toHaveBeenCalledWith('flight name');
  });
});