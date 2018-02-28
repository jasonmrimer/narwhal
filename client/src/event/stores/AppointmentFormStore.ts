import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { action } from 'mobx';
import { EventActions } from './EventActions';

interface State {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

export class AppointmentFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
    super();
  }

  protected itemToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      title: item.title,
      description: item.description,
      startDate: item.startTime.format('YYYY-MM-DD'),
      startTime: item.startTime.format('HHmm'),
      endDate: item.endTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('HHmm')
    };
  }

  protected emptyState(): State {
    return {
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: ''
    };
  }

  @action.bound
  addItem(airmanId: number): void {
    const event = new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startDate, this._state.startTime),
      this.makeMoment(this._state.endDate, this._state.endTime),
      airmanId,
      EventType.Appointment,
      this.item ? this.item.id : null
    );
    this.eventActions.addEvent(event);
  }

  @action.bound
  removeItem(): void {
    if (this.item != null) {
      this.eventActions.removeEvent(this.item);
    }
  }
}