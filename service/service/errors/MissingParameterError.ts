import HttpError from "./HttpError";

class MissingParameterError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = "MissingParameterError";
    this.statusCode = 400;
  }
}

export default MissingParameterError;