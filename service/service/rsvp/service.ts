import { PrismaClient, Rsvp } from "../../prisma/prisma-client";
import { PrismaClientKnownRequestError } from "../../prisma/prisma-client/runtime/client";
import { logger } from "../../util/logger";
import AlreadyExistError from "../errors/AlreadyExistError";
import { RsvpRequest } from "./type";

export class RsvpService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async rsvp(request: RsvpRequest): Promise<Rsvp> {
    const existingGuest = await this.prisma.guest.findFirst({
      where: {
        OR: [
          { 
            AND: [
              { firstName: request.guest.firstName },
              { lastName: request.guest.lastName }
            ]
          },
          { email: request.guest.email },
        ],
      },
    });
    if (existingGuest) {
      throw new AlreadyExistError(`Guest already exists. first name: ${request.guest?.firstName}, lastName: ${request.guest?.lastName} email: ${request.guest?.email}`);
    }

    if (request.plusOne) {
      const existingPlusOne = await this.prisma.guest.findFirst({
        where: {
          firstName: request.plusOne?.firstName,
          lastName: request.plusOne?.lastName
        }
      });
      if (existingPlusOne) {
        throw new AlreadyExistError(`Plus one already exists. first name: ${request.plusOne?.firstName}, lastName: ${request.plusOne?.lastName} email: ${request.plusOne?.email}`);
      }
    }

    const guestsData = [
      {
        firstName: request.guest.firstName,
        lastName: request.guest.lastName,
        email: request.guest.email,
        mealOption: request.guest.meal,
        isPrimary: true
      }
    ];
    if (request.plusOne) {
      guestsData.push({
        firstName: request.plusOne.firstName,
        lastName: request.plusOne.lastName,
        email: request.plusOne.email,
        mealOption: request.plusOne.meal,
        isPrimary: false
      });
    }

    const rsvp = await this.prisma.rsvp.create({
      data: {
        guests: { create: guestsData }
      }
    });
    logger.info(`RSVP stored in database: ${rsvp.id}`);
    return rsvp;
  }
}