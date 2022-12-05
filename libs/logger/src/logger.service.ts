import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';
import { FastifyRequest } from '../../types/src/index';

@Injectable()
export class LoggerService {
  private winstonLogger: Logger = null;

  constructor() {
    const consoleTransporter = new transports.Console();

    this.winstonLogger = createLogger({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: '' }),
        format.errors({ stack: true }),
      ),
      exitOnError: false,
      transports: [consoleTransporter],
    });
  }

  extractDataFromRequest(req: FastifyRequest, additionalInfo = null) {
    if (!req) return {};

    let API_NAME = req.url.split('?')[0] || 'UN_KNOWN';

    if (API_NAME !== 'UN_KNOWN') {
      Object.entries(req.params).map(([key, value]) => {
        API_NAME = API_NAME.replace(value, `:${key}`);
        return null;
      });
    }

    const API_BODY: any = req.body;
    const API_METHOD: string = req.routerMethod;
    const API_ORIGINAL_URL: string = req.url;
    const API_PARAMS: unknown = req.params;
    const API_QUERY: unknown = req.query;
    const API_USER: string = req.user ? req.user.userName : 'NOT_LOGGED_IN';
    const REQ_HOST: string = req.hostname;
    const REQ_IP: string = req.ip;
    const REQ_PROTOCOL: string = req.protocol;

    if (API_BODY && API_BODY.password) {
      delete API_BODY.password;
    }

    if (API_BODY && API_BODY.email) {
      delete API_BODY.email;
    }

    if (API_BODY && API_BODY.secondaryEmail) {
      delete API_BODY.secondaryEmail;
    }

    return {
      API_BODY,
      API_METHOD,
      API_ORIGINAL_URL,
      API_PARAMS,
      API_QUERY,
      API_USER,
      REQ_HOST,
      REQ_IP,
      REQ_PROTOCOL,
      ADDITIONAL_INFO: additionalInfo,
    };
  }

  error = (error: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.error(
      `${error}`,
      this.extractDataFromRequest(request, information),
    );
  };

  warn = (warning: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.warn(
      `${warning}`,
      this.extractDataFromRequest(request, information),
    );
  };

  info = (info: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.info(
      `${info}`,
      this.extractDataFromRequest(request, information),
    );
  };

  http = (http: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.http(
      `${http}`,
      this.extractDataFromRequest(request, information),
    );
  };

  verbose = (verbose: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.verbose(
      `${verbose}`,
      this.extractDataFromRequest(request, information),
    );
  };

  debug = (debug: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.debug(
      `${debug}`,
      this.extractDataFromRequest(request, information),
    );
  };

  silly = (silly: unknown, request: FastifyRequest, information = null) => {
    return this.winstonLogger.silly(
      `${silly}`,
      this.extractDataFromRequest(request, information),
    );
  };
}
