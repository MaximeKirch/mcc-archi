import { createStart } from "@tanstack/react-start";
import { maintenanceMiddleware } from "#/server/maintenance.ts";

export const startInstance = createStart(() => ({
  requestMiddleware: [maintenanceMiddleware],
}));
