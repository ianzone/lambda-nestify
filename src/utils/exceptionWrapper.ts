import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
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

export function exceptionWrapper(error: { message: string; statusCode: number }) {
  switch (error.statusCode) {
    case 400:
      throw new BadRequestException(error.message);
    case 401:
      throw new UnauthorizedException(error.message);
    case 403:
      throw new ForbiddenException(error.message);
    case 404:
      throw new NotFoundException(error.message);
    case 405:
      throw new MethodNotAllowedException(error.message);
    case 406:
      throw new NotAcceptableException(error.message);
    case 408:
      throw new RequestTimeoutException(error.message);
    case 409:
      throw new ConflictException(error.message);
    case 410:
      throw new GoneException(error.message);
    case 412:
      throw new PreconditionFailedException(error.message);
    case 413:
      throw new PayloadTooLargeException(error.message);
    case 415:
      throw new UnsupportedMediaTypeException(error.message);
    case 418:
      throw new ImATeapotException(error.message);
    case 422:
      throw new UnprocessableEntityException(error.message);
    case 500:
      throw new InternalServerErrorException(error.message);
    case 501:
      throw new NotImplementedException(error.message);
    case 502:
      throw new BadGatewayException(error.message);
    case 503:
      throw new ServiceUnavailableException(error.message);
    case 504:
      throw new GatewayTimeoutException(error.message);
    case 505:
      throw new HttpVersionNotSupportedException(error.message);
    default:
      throw new InternalServerErrorException(error.message);
  }
}
