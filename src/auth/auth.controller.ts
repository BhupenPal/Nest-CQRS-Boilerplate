import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FastifyReply, FastifyRequest } from '@app/types';
import {
  JWTAuthGuard,
  LocalAuthGuard,
  SetAuthTokenCommand,
} from '@app/authguard';

// COMMAND
import { CreateUserCommand } from 'src/user/commands/impl/create-user.command';
import { GetAuthTokenForSocketCommand } from './commands/impl/get-auth-token-socket.command';

// QUERY

// DTO
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignupDto) {
    return await this.commandBus.execute(
      new CreateUserCommand(
        body.givenName,
        body.familyName,
        body.email,
        body.password,
      ),
    );
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signin(
    @Body() body: SigninDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    return await this.commandBus.execute(
      new SetAuthTokenCommand(req.user, req, res),
    );
  }

  @Get('socket-auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  async getTokenForSocket(@Req() req: FastifyRequest) {
    return await this.commandBus.execute(
      new GetAuthTokenForSocketCommand(req.user, req),
    );
  }
}
