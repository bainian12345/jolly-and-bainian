import "dotenv/config";
import { PrismaClient, Invitation as PrismaInvitation, Guest as PrismaGuest } from "../../prisma/prisma-client";
import { logger } from "../../util/logger";
import AlreadyExistError from "../errors/AlreadyExistError";
import { Guest, Invitation,RsvpRequest } from "./type";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import NotFoundError from "../errors/NotFoundError";
import MissingParameterError from "../errors/MissingParameterError";

interface EmailMessage {
  to: string;
  guest: string;
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

  async getInvitation(invitationId: string): Promise<Invitation> {
    const invitation: PrismaInvitation & { guests: PrismaGuest[] } = await this.prisma.invitation.findUnique({
      include: { guests: true },
      where: { id: invitationId }
    });
    if (!invitation) {
      throw new NotFoundError(`Invitation not found. invitationId: ${invitationId}`);
    }
    return {
      id: invitation.id,
      maxGuests: invitation.maxGuests,
      guests: invitation.guests.map(guest => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        meal: guest.mealOption,
      })),
    };
  }

  async rsvp(request: RsvpRequest): Promise<Invitation> {
    await this.validateRsvp(request);

    const guestsData = [];
    const guestEmails = new Map<string, Guest>();
    for (const guest of request.guests) {
      guestsData.push({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        mealOption: guest.meal,
      });
      if (guest.email) {
        guestEmails.set(guest.email, guest);
      }
    }

    const emailMessages: EmailMessage[] = [];
    for (const guestEmail of guestEmails) {
      emailMessages.push({
        to: guestEmail[0],
        guest: guestEmail[1].firstName,
      });
    }
    const invitation: PrismaInvitation & { guests: PrismaGuest[] } = await this.prisma.$transaction(async (tx) => {
      const invitation = await tx.invitation.update({
        data: {
          guests: { 
            create: guestsData
          },
          dateTimeAccepted: new Date(),
        },
        include: { guests: true },
        where: { id: request.invitationId }
      });

      for (const emailMessage of emailMessages) {
        await this.sqs.send(new SendMessageCommand({
          QueueUrl: process.env.EMAIL_SENDER_QUEUE_URL!,
          MessageBody: JSON.stringify(emailMessage)
        }));
      }
      return invitation;
    });

    logger.info(`RSVP stored in database: ${invitation.id}`);
    return {
      id: invitation.id,
      maxGuests: invitation.maxGuests,
      dateTimeAccepted: invitation.dateTimeAccepted,
      guests: invitation.guests.map(guest => ({
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        meal: guest.mealOption,
      })),
    }
  }

  async validateRsvp(request: RsvpRequest): Promise<void> {
    if (!request.invitationId) {
      throw new MissingParameterError("No invitation ID provided");
    }
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: request.invitationId }
    });
    if (!invitation) {
      throw new NotFoundError(`Invitation not found. invitationId: ${request.invitationId}`);
    }
    if (invitation.dateTimeAccepted) {
      throw new AlreadyExistError(`Invitation already accepted. invitationId: ${request.invitationId}`);
    }
  }
}