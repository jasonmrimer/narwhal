import { EventModel, EventType } from '../models/EventModel';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventActions } from './EventActions';
import { action } from 'mobx';

interface State {
  missionId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class MissionFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
    super();
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

  @action.bound
  clearState() {
    this._state = this.emptyState();
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