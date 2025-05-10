export interface Repository<T, K extends keyof T> {
  list(filter?: (record: T) => boolean): Promise<T[]>;
  create(data: Omit<T, K>): Promise<T>;
  read(key: T[K]): Promise<T>;
  update(key: T[K], data: Omit<T, K>): Promise<T>;
  delete(key: T[K]): Promise<void>;
}
