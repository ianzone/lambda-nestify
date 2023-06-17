import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  HttpVersionNotSupportedException,
  ImATeapotException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

export function errorWrapper(statusCode: number | string, message?: string): HttpException {
  const status = typeof statusCode === 'string' ? parseInt(statusCode) : statusCode;

  switch (status) {
    case 400:
      throw new BadRequestException(message);
    case 401:
      throw new UnauthorizedException(message);
    case 403:
      throw new ForbiddenException(message);
    case 404:
      throw new NotFoundException(message);
    case 405:
      throw new MethodNotAllowedException(message);
    case 406:
      throw new NotAcceptableException(message);
    case 408:
      throw new RequestTimeoutException(message);
    case 409:
      throw new ConflictException(message);
    case 410:
      throw new GoneException(message);
    case 412:
      throw new PreconditionFailedException(message);
    case 413:
      throw new PayloadTooLargeException(message);
    case 415:
      throw new UnsupportedMediaTypeException(message);
    case 418:
      throw new ImATeapotException(message);
    case 422:
      throw new UnprocessableEntityException(message);
    case 500:
      throw new InternalServerErrorException(message);
    case 501:
      throw new NotImplementedException(message);
    case 502:
      throw new BadGatewayException(message);
    case 503:
      throw new ServiceUnavailableException(message);
    case 504:
      throw new GatewayTimeoutException(message);
    case 505:
      throw new HttpVersionNotSupportedException(message);
    default:
      throw new InternalServerErrorException(message);
  }
}
