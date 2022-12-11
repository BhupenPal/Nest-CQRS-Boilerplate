import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class RecaptchaAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const googleRecaptchaToken = req.body.recaptchaToken;

    const token = await firstValueFrom(
      this.httpService
        .post(
          'https://www.google.com/recaptcha/api/siteverify',
          {},
          {
            params: {
              secret: this.configService.get<string>('GOOGLE_RECAPTCHA_SECRET'),
              response: googleRecaptchaToken,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('THROWING ERROR', error);
            throw new InternalServerErrorException();
          }),
        ),
    );

    if (token.data.success === false || token.data.score <= 0.5) {
      throw new ForbiddenException('Request score not healthy.');
    }

    return true;
  }
}
