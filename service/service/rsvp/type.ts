/**
 * Used for RSVP request input
 */
export interface RsvpRequest {
  invitationId: string;
  guests: Guest[];
}

/**
 * Used in HTTP requests and responses with the client
 */
export interface Guest {
  firstName: string;
  lastName: string;
  email?: string;
  meal: string;
}

/**
 * Used in HTTP requests and responses with the client
 */
export interface Invitation {
  id: string;
  maxGuests: number;
  dateTimeAccepted?: Date;
  guests: Guest[];
}
