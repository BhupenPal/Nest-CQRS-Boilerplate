import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/user/entities/user';
import { GetUserQuery } from '../impl/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  //   constructor() {}

  async execute(query: GetUserQuery): Promise<string> {
    return 'GET USER QUERY - CALLED';
  }
}
