class AlreadyExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlreadyExistError";
  }
}

export default AlreadyExistError;