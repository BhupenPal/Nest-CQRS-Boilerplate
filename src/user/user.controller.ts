import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';

@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserCommand) {
    return await this.queryBus.execute(body);
  }
}
