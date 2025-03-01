import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

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
      return rpcError;
    }


    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      error: rpcError
    };
  }
}
