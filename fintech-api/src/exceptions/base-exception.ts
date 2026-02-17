export class BaseException extends Error {
  public code: string;
  public httpCode: number;

  constructor(message: string, httpCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.httpCode = httpCode;
    this.code = code;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      error: {
        message: this.message,
        code: this.code,
      },
    };
  }
}
