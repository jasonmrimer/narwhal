import { EventModel, EventType } from '../models/EventModel';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventActions } from './EventActions';
import { action, computed, observable } from 'mobx';
import { MissionModel } from '../../mission/models/MissionModel';

interface State {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class MissionFormStore extends FormStore<EventModel, State> {
  @observable private _missions: MissionModel[] = [];

  constructor(private eventActions: EventActions) {
    super();
    this._state = {
      id: '',
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action.bound
  hydrate(missions: MissionModel[]) {
    this._missions = missions;
  }

  @action
  setState(key: keyof State, value: string) {
    if (key !== 'id') {
      return;
    }

    if (value === '') {
      this._state = this.emptyState();
      return;
    }

    const mission = this._missions.find(msn => msn.id === Number(value));
    if (mission == null) {
      return;
    }

    this._state = {
      id: String(mission.id),
      title: mission.atoMissionNumber,
      startDate: mission.startDateTime.format('YYYY-MM-DD'),
      startTime: mission.startDateTime.format('HHmm'),
      endDate: mission.endDateTime ? mission.endDateTime.format('YYYY-MM-DD') : '',
      endTime: mission.endDateTime ? mission.endDateTime.format('HHmm') : ''
    };
  }

  protected modelToState(model: EventModel | null): State {
    if (model == null) {
      return this.emptyState();
    }
    return {
      id: String(model.id),
      title: model.title,
      startDate: model.startTime.format('YYYY-MM-DD'),
      startTime: model.startTime.format('HHmm'),
      endDate: model.endTime.format('YYYY-MM-DD'),
      endTime: model.endTime.format('HHmm')
    };
  }

  protected emptyState(): State {
    return {
      id: '',
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  async addModel(airmanId: number) {
    const event = new EventModel(
      this._state.title,
      '',
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Mission,
      this.model ? Number(this.model.id) : Number(this._state.id)
    );
    await this.eventActions.addEvent(event);
  }

  removeModel(): void {
    if (this.model != null) {
      this.eventActions.removeEvent(this.model);
    }
  }

  @computed
  get missions() {
    return this._missions;
  }

  @computed
  get missionOptions() {
    return this._missions.map(msn => {
      return {value: msn.id, label: `${msn.displayDate} - ${msn.atoMissionNumber}`};
    });
  }
}