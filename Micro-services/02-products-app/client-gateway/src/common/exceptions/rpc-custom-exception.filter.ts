import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      // this said that the status is not a function
      //      return response.status(status).json(rpcError);

      // TypeError: response.status is not a function
      return response.send({
        status: status,
        message: rpcError.message,
      });
    }

    return response.send({
      status: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  }
}
