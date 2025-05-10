import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { SensorValuesRepository } from "./sensor_values_repository";
import { database } from "../database";

describe("SensorValuesRepository", () => {
  beforeEach(() => {
    database.clear();
  });

  it("should create", async () => {
    const entry = {
      sensor_id: 1,
      timestamp: 123456789,
      values: [1, 2, 3],
    };

    const result = await SensorValuesRepository.create(entry);

    assert.deepEqual(result, { id: 1, ...entry });
  });

  it("should be able to list with a filter", async () => {
    const entries = [
      {
        sensor_id: 1,
        timestamp: 123456789,
        values: [1, 2, 3],
      },
      {
        sensor_id: 2,
        timestamp: 123456790,
        values: [3, 2, 1],
      },
    ];
    Promise.all(entries.map((entry) => SensorValuesRepository.create(entry)));

    const list = await SensorValuesRepository.list(
      (value) => value.sensor_id === 2
    );

    assert.deepEqual(list, [{ id: 2, ...entries[1] }]);
  });

  it("should delete an entry by id", async () => {
    const entry1 = {
      sensor_id: 1,
      timestamp: 123456789,
      values: [1, 2, 3],
    };
    const entry2 = {
      sensor_id: 2,
      timestamp: 123456790,
      values: [3, 2, 1],
    };

    const sensorValue = await SensorValuesRepository.create(entry1);
    await SensorValuesRepository.create(entry2);

    await SensorValuesRepository.delete(sensorValue.id);

    const remaining = await SensorValuesRepository.list(() => true);

    assert.deepEqual(remaining, [{ id: 2, ...entry2 }]);
  });
});
