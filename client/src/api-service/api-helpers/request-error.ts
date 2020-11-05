export class RequestError extends Error {
  responseCode: number;
  responseBody: Record<string, unknown>;
  constructor(
    message: string,
    status: number,
    details: Record<string, unknown>
  ) {
    super(message);
    this.name = "RequestError";
    this.responseCode = status;
    this.responseBody = details;
  }
}
