export interface IUser extends Document {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly isValid: boolean;
}
