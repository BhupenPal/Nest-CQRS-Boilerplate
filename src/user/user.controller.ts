import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';

@Controller('user')
export class UserController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUser() {
    return await this.queryBus.execute(new GetUserQuery());
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserCommand) {
    return await this.queryBus.execute(body);
  }
}
