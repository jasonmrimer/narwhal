export interface DefaultValue {
  value: number;
  text: string;
}

export default (text: string): DefaultValue => {
  return {
    value: -1,
    text: text
  };
};