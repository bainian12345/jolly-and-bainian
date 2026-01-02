import express, { Express, Request, Response } from 'express';
import { logger } from './util/logger';

export function setupApp() {
  const app: Express = express();

  app.use(express.json());

  app.get("/api", (_req: Request, res: Response) => {
    logger.info("Root route reached");
    res.status(200).send("Jolly and Bainian");
  });

  // Mount router with explicit prefix
  app.get("/api/health", (_req: Request, res: Response) => {
    logger.info("Health route reached");
    res.status(200).send("Health OK");
  });

  app.post("/api/rsvp", (_req: Request, res: Response) => {
    logger.info(`RSVP route reached: ${JSON.stringify(_req.body)}`);
    res.status(200).json({ message: "RSVP received" });
  });

  return app;
}

export function startServer(app: Express) {
  const port = process.env.API_PORT || 3000;
  const listener = app.listen(port, () => {
    logger.info(`Jolly and Bainian listening on port ${port}`);
  });
  return listener;
}

startServer(setupApp());