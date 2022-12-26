import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';

// DTO
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { GetUserProfileQuery } from './queries/impl/get-user-profile.query';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':id/profile')
  @HttpCode(HttpStatus.OK)
  async getUserProfile(@Param() param: GetUserProfileDto) {
    const { id: userId } = param;

    return await this.queryBus.execute(new GetUserProfileQuery(userId));
  }
}
