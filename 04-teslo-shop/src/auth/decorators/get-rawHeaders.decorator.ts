import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data: string, ctx: ExecutionContext) =>{
        const req = ctx.switchToHttp().getRequest();
        const headers = req.rawHeaders;
        if(!headers)throw new Error('Headers not found (request)');

        return headers;
    }
)