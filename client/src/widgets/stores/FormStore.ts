import { action, computed, observable } from 'mobx';
import * as moment from 'moment';

export interface UniqueItem {
  id: number | null;
}

export abstract class FormStore<T extends UniqueItem, S> {
  @observable protected item: T | null = null;
  @observable protected _state: S;
  @observable protected _errors: object[] = [];

  protected abstract itemToState(item: T | null): S;

  protected abstract emptyState(): S;

  public abstract addItem(airmanId: number): void;

  public abstract removeItem(): void;

  @action
  open(item: T | null = null) {
    this._errors = [];
    this.item = item;
    this._state = this.itemToState(item);
  }

  @action
  close() {
    this._errors = [];
    this.item = null;
    this._state = this.emptyState();
  }

  @computed
  get state() {
    return this._state;
  }

  @action
  setState(state: Partial<S>) {
    this._state = Object.assign({}, this._state, state);
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action
  setErrors(errors: object[]) {
    this._errors = errors;
  }

  @computed
  get hasItem() {
    return this.item != null && this.item!.id != null;
  }

  protected makeMoment(date: string, time: string) {
    if (date === '') {
      return moment.invalid();
    }
    return moment(`${date} ${time}`, 'YYYY-MM-DD HHmm');
  }
}