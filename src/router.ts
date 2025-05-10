// src/router.ts
import Router from "@koa/router";
import { z } from "zod";
import { Controller } from "./controllers/_controller";
import { SensorsController } from "./controllers/sensors_controller";
import { validate } from "./middleware/validate";
import { catchAsync } from "./middleware/catchAsync";

const router = new Router();

const controllers: Record<string, Controller> = {
  "/sensors": SensorsController,
};

const IdSchema = z.object({ id: z.coerce.number().nonnegative() });
const SensorBodySchema = z.object({
  name: z.string().min(1, "Sensor name is required").max(250, "Sensor name is too long"),
});

for (const [path, controller] of Object.entries(controllers)) {
  if (controller.list) {
    router.get(
        path,
        catchAsync(controller.list)
    );
  }
  if (controller.create) {
    router.post(
        path,
        validate({ body: SensorBodySchema }),
        catchAsync(controller.create)
    );
  }
  if (controller.read) {
    router.get(
        `${path}/:id`,
        validate({ params: IdSchema }),
        catchAsync(controller.read)
    );
  }
  if (controller.update) {
    router.post(
        `${path}/:id`,
        validate({ params: IdSchema, body: SensorBodySchema }),
        catchAsync(controller.update)
    );
  }
  if (controller.delete) {
    router.delete(
        `${path}/:id`,
        validate({ params: IdSchema }),
        catchAsync(controller.delete)
    );
  }
}

export default router;