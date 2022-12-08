import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/user/commands/impl/create-user.command';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly createUserCommand: CreateUserCommand,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body) {
    return await this.commandBus.execute(new CreateUserCommand('', '', '', ''));
  }
}
