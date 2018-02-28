import { action, computed, observable } from 'mobx';
import * as moment from 'moment';

export abstract class FormStore<T, S> {
  @observable protected item: T | null = null;
  @observable protected _state: S;
  @observable protected _errors: object[] = [];

  constructor() {
    this._state = this.emptyState();
  }

  protected abstract itemToState(item: T | null): S;

  protected abstract emptyState(): S;

  public abstract addItem(airmanId: number): void;

  public abstract removeItem(): void;

  @action.bound
  open(item: T | null = null) {
    this._errors = [];
    this.item = item;
    this._state = this.itemToState(item);
  }

  @action.bound
  close() {
    this._errors = [];
    this.item = null;
    this._state = this.emptyState();
  }

  @computed
  get state() {
    return this._state;
  }

  @action.bound
  setState(state: Partial<S>) {
    this._state = Object.assign({}, this._state, state);
  }

  @computed
  get errors() {
    return this._errors;
  }

  @action.bound
  setErrors(errors: object[]) {
    this._errors = errors;
  }

  @computed
  get hasItem() {
    return this.item != null;
  }

  protected makeMoment(date: string, time: string) {
    if (date === '') {
      return moment.invalid();
    }
    return moment(`${date} ${time}`, 'YYYY-MM-DD HHmm');
  }
}