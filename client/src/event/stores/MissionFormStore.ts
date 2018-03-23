import { EventModel, EventType } from '../models/EventModel';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventActions } from './EventActions';
import { action } from 'mobx';
import { MissionStore } from '../../mission/stores/MissionStore';

interface State {
  id: number | null;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class MissionFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions,
              private missionStore: MissionStore) {
    super();
    this._state = {
      id: null,
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action
  setState(state: Partial<State>) {
    if (state.id === null) {
      this._state = this.emptyState();
    } else {
      const mission = this.missionStore.missions.find(msn => msn.id === state.id);
      if (mission != null) {
        this._state = {
          id: mission.id,
          title: mission.atoMissionNumber,
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
      id: item.id,
      title: item.title,
      startDate: item.startTime.format('YYYY-MM-DD'),
      startTime: item.startTime.format('HHmm'),
      endDate: item.endTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('HHmm')
    };
  }

  protected emptyState(): State {
    return {
      id: null,
      title: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  addItem(airmanId: number): void {
    const event = new EventModel(
      this._state.title,
      '',
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Mission,
      this.item ? this.item.id : this._state.id
    );
    this.eventActions.addEvent(event);
  }

  removeItem(): void {
    if (this.item != null) {
      this.eventActions.removeEvent(this.item);
    }
  }
}