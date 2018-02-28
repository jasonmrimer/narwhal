import { EventModel, EventType } from '../models/EventModel';
import { EventActions } from './EventActions';
import { FormStore } from '../../widgets/stores/FormStore';

interface State {
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class LeaveFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
    super();
  }

  protected itemToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      description: item.description,
      startDate: item.startTime.format('YYYY-MM-DD'),
      startTime: item.startTime.format('HHmm'),
      endDate: item.endTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('HHmm'),
    };
  }

  protected emptyState(): State {
    return {
      description: '',
      startDate: '',
      startTime: '0000',
      endDate: '',
      endTime: '2359'
    };
  }

  addItem(airmanId: number): void {
    const event = new EventModel(
      'Leave',
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Leave,
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