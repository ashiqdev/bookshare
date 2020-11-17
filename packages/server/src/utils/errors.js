/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
export class GeneralError extends Error {
  constructor(message, type = "message") {
    super();
    this.message = message;
    this.type = type;
  }

  getCode() {
    return 400;
  }
}

export class BadRequest extends GeneralError {
  constructor(message, type, extractedErrors = []) {
    super(message, type, extractedErrors);
    this.name = "BadRequest";
    this.extractedErrors = extractedErrors;
  }

  getCode() {
    return 400;
  }
}

export class NotFound extends GeneralError {
  constructor(message, type) {
    super(message, type);
    this.name = "NotFound";
  }

  getCode() {
    return 404;
  }
}
