import HttpError from "./HttpError";

class AlreadyExistError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistError";
    this.statusCode = 409;
  }
}

export default AlreadyExistError;