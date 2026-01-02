export interface RsvpRequest {
  guest: GuestInput;
  plusOne: GuestInput | null;
}

export interface GuestInput {
  firstName: string;
  lastName: string;
  email?: string;
  meal: string;
}