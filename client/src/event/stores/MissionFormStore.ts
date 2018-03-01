import { EventModel, EventType } from '../models/EventModel';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventActions } from './EventActions';
import { action } from 'mobx';
import { MissionStore } from '../../mission/stores/MissionStore';

interface State {
  missionId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class MissionFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions,
              private missionStore: MissionStore) {
    super();
  }

  @action
  setState(state: Partial<State>) {
    if (state.missionId === '') {
      this._state = this.emptyState();
    } else {
      const mission = this.missionStore.missions.find(msn => msn.missionId === state.missionId);
      if (mission != null) {
        this._state = {
          missionId: mission.missionId,
          startDate: mission.startDateTime.format('YYYY-MM-DD'),
          startTime: mission.startDateTime.format('HHmm'),
          endDate: mission.endDateTime ? mission.endDateTime.format('YYYY-MM-DD') : '',
          endTime: mission.endDateTime ? mission.endDateTime.format('HHmm') : ''
        };
      }
    }
  }

  protected itemToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      missionId: item.title,
      startDate: item.startTime.format('YYYY-MM-DD'),
      startTime: item.startTime.format('HHmm'),
      endDate: item.endTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('HHmm')
    };
  }

  protected emptyState(): State {
    return {
      missionId: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  addItem(airmanId: number): void {
    const event = new EventModel(
      this._state.missionId,
      '',
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Mission,
      this.item ? this.item.id : null
    );
    this.eventActions.addEvent(event);
  }

  removeItem(): void {
    if (this.item != null) {
      this.eventActions.removeEvent(this.item);
    }
  }
}