export class DomainException extends Error {
  constructor(
    message: string,
    public readonly code = 'bad_request',
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}
