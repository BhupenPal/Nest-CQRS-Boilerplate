import { LocalAuthGuard } from '@app/authguard';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

// COMMAND
import { CreateUserCommand } from 'src/user/commands/impl/create-user.command';

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
  async signin(@Body() body: SigninDto) {
    // return await this.queryBus.execute(
    //   new AuthenticateUserQuery(body.email, body.password),
    // );
  }
}
