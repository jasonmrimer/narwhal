import { action } from 'mobx';
import { FormStore } from '../../widgets/stores/FormStore';
import { EventModel, EventType } from '../models/EventModel';
import { EventActions } from './EventActions';

interface State {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

export class TDYDeploymentFormStore extends FormStore<EventModel, State> {
  constructor(private eventActions: EventActions) {
    super();
    this._state = {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    };
  }

  @action
  setState(state: Partial<State>): void {
    if (state.startTime && !this._state.endTime) {
      state.endTime = state.endTime || state.startTime;
    }

    super.setState(state);
  }

  protected itemToState(item: EventModel | null): State {
    if (item == null) {
      return this.emptyState();
    }
    return {
      title: item.title,
      description: item.description,
      startTime: item.startTime.format('YYYY-MM-DD'),
      endTime: item.endTime.format('YYYY-MM-DD'),
    };
  }

  protected emptyState(): State {
    return {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    };
  }

  addItem(airmanId: number): void {
    const event = new EventModel(
      this._state.title,
      this._state.description,
      this.makeMoment(this._state.startTime, '0000'),
      this.makeMoment(this._state.endTime, '2359'),
      airmanId,
      EventType.TDY_DEPLOYMENT,
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