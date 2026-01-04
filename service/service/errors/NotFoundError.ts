import HttpError from "./HttpError";

class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export default NotFoundError;