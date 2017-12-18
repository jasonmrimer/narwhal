export interface Serializer<T> {
  serialize(item: T): {};
  deserialize(item: {}): T;
}