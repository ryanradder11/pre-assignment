import { database } from "../database";
import { autoIncrement } from "../utils/identifiers";
import { Repository } from "./_repository";

export type SensorValue = {
  id: number;
  timestamp: number;
  sensor_id: number;
  values: number[];
};

export const SensorValuesRepository: Repository<SensorValue, "timestamp"> = {
  async list(filter) {
    if (filter) {
      return database.sensorValues.filter(filter);
    }
    return database.sensorValues;
  },

  async create(data) {
    const value: SensorValue = {
      timestamp: Date.now(),
      ...data,
    };
    database.sensorValues.push(value);
    return value;
  },

  async read(timestamp) {
    const value = database.sensorValues.find((value) => value.timestamp === timestamp);
    if (!value) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    return value;
  },

  async update(timestamp, data) {
    const index = database.sensorValues.findIndex((value) => value.timestamp === timestamp);
    if (index === -1) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    const value = { timestamp, ...data };
    database.sensorValues[timestamp] = value;
    return value;
  },

  async delete(timestamp) {

    const index = database.sensorValues.findIndex((value) => value.timestamp === timestamp);

    if (index === -1) {
      throw new Error(`Failed to find SensorValue with timestamp '${timestamp}'`);
    }
    delete database.sensorValues[index];
  },
};
