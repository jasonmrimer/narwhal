export interface DefaultValue {
  value: number;
  label: string;
}

export default (label: string): DefaultValue => {
  return {
    value: -1,
    label: label
  };
};