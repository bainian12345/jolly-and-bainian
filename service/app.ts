import express, { Express, Request, Response } from 'express';
import { logger } from './util/logger';
import { PrismaClient } from './prisma/prisma-client';
import { RsvpService } from './service/rsvp/service';
import { PrismaPg } from '@prisma/adapter-pg';

export function setupApp() {
  const app: Express = express();
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!
    })
  });

  const rsvpService = new RsvpService(prisma);
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

  app.post("/api/rsvp", async (_req: Request, res: Response) => {
    logger.info(`Received RSVP request: ${JSON.stringify(_req.body)}`);
    const rsvp = await rsvpService.rsvp(_req.body);
    res.status(200).json({ id: rsvp.id });
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