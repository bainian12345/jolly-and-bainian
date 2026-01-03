import "dotenv/config";
import { PrismaClient, Rsvp } from "../../prisma/prisma-client";
import { logger } from "../../util/logger";
import AlreadyExistError from "../errors/AlreadyExistError";
import { RsvpRequest } from "./type";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

interface EmailMessage {
  to: string;
  guest: string;
  plusOne?: string;
}

export class RsvpService {
  prisma: PrismaClient;
  sqs: SQSClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.sqs = new SQSClient({ 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      },
      region: "us-east-1" 
    });
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

    const emailMessage: EmailMessage = {
      to: request.guest.email,
      guest: request.guest.firstName,
      plusOne: request.plusOne?.firstName
    };
    const rsvp = await this.prisma.$transaction(async (tx) => {
      const rsvp = await tx.rsvp.create({
        data: {
          guests: { create: guestsData }
        }
      });

      await this.sqs.send(new SendMessageCommand({
        QueueUrl: process.env.EMAIL_SENDER_QUEUE_URL!,
        MessageBody: JSON.stringify(emailMessage)
      }));
      return rsvp;
    });

    logger.info(`RSVP stored in database: ${rsvp.id}`);
    return rsvp;
  }
}