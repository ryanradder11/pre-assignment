import { z } from "zod";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";
import { Sensor, SensorsRepository } from "../repositories/sensors_repository";
import { Controller } from "./_controller";

export const SensorsController: Controller = {
  async list(ctx) {
    const list = await SensorsRepository.list();
    ctx.body = list;
  },

  async read(ctx) {
    const { id } = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .parse(ctx.params);

    const sensor = await SensorsRepository.read(id);
    const values = await SensorValuesRepository.list(
      (value) => value.sensor_id === id
    );

    ctx.body = values.map(value => {
      const average = Math.round(value.values.reduce((sum, n) => sum + n, 0) / value.values.length);
      return [value.timestamp, average];
    });
  },

  async update(ctx) {
    const { id } = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .parse(ctx.params);

    const sensor = await SensorsRepository.update(id, ctx.request.body as any);

    ctx.body = {
      ...sensor,
    };
  },
};
