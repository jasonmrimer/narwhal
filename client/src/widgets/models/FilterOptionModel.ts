import { Moment } from 'moment';

export const UnfilteredValue = -1;

export interface FilterOption {
  value: string | number;
  label: string;
  date?: Moment;
}
