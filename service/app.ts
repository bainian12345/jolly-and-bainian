import express, { Express, Request, Response } from 'express';
import { logger } from './util/logger';

export function setupApp() {
  const app: Express = express();

  app.use(express.json());

  app.get("/", (_req: Request, res: Response) => {
    logger.info("Root route reached");
    res.status(200).send("Jolly and Bainian");
  });

  // Mount router with explicit prefix
  app.get("/health", (_req: Request, res: Response) => {
    logger.info("Health route reached");
    res.status(200).send("Health OK");
  });

  return app;
}

export function startServer(app: Express) {
  const port = process.env.API_PORT || 80;
  const listener = app.listen(port, () => {
    logger.info(`Jolly and Bainian listening on port ${port}`);
  });
  return listener;
}

startServer(setupApp());