import { action, computed, observable } from 'mobx';
import { ProfileModel } from '../../profile/models/ProfileModel';
import { SquadronModel } from '../../squadron/models/SquadronModel';
import { NotificationStore } from '../../widgets/stores/NotificationStore';
import { AirmanModel, ShiftType } from '../../airman/models/AirmanModel';
import { CertificationModel } from '../../skills/models/CertificationModel';

export class SiteManagerStore extends NotificationStore {
  @observable private _profile: ProfileModel | null = null;
  @observable private _squadron: SquadronModel;
  @observable private _airmen: AirmanModel[] = [];
  @observable private _certifications: CertificationModel[] = [];

  @action.bound
  hydrate(profile: ProfileModel, squadron: SquadronModel, airmen: AirmanModel[], certifications: CertificationModel[]) {
    this._profile = profile;
    this._squadron = squadron;
    this._airmen = airmen.filter(a => a.squadronId === squadron.id);
    this._certifications = certifications;
  }

  @computed
  get siteName() {
    if (this._profile) {
      return this._profile!.siteName;
    }
    return '';
  }

  @computed
  get squadron() {
    return this._squadron;
  }

  @computed
  get certifications() {
    return this._certifications;
  }

  @computed
  get airmen() {
    return this._airmen;
  }

  @action.bound
  setAirmenShiftByFlightId(flightId: number, shift: ShiftType) {
    this._airmen
      .filter(airman => airman.flightId === flightId)
      .forEach(airman => airman.shift = shift);
  }

  getAirmenByFlightId = (flightId: number) => {
    return this.airmen.filter(a => a.flightId === flightId);
  }

  getShiftByFlightId = (flightId: number) => {
    const shiftCount = {
      [ShiftType.Day]: 0,
      [ShiftType.Night]: 0,
      [ShiftType.Swing]: 0
    };
    let max = 0;
    let flightShift = null;

    this.getAirmenByFlightId(flightId).forEach(airman => {
      if (airman.shift == null) {
        return;
      }

      shiftCount[airman.shift] += 1;
      if (shiftCount[airman.shift] <= max) {
        return;
      }

      max = shiftCount[airman.shift];
      flightShift = airman.shift;
    });

    return flightShift;
  }
}