import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class ExceptionsFilter implements ExceptionFilter{
    private readonly logger = new Logger(ExceptionsFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';
        this.logger.error({
            timestamp: new Date().toLocaleTimeString(),
            path: request.url,
            method: request.method,
            error: exception.message,
            details: message
        });

        response.status(status).json({
            statusCode: status,
            path: request.url,
            message
        });
    }
}