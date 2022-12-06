import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrimaryDB } from 'src/prisma/primary.service';
import { GetUserQuery } from '../impl/get-user.query';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly prisma: PrimaryDB) {}

  async execute(query: GetUserQuery): Promise<string> {
    const email = await this.prisma.user.findFirst({
      where: { email: 'bhupen16pal@gmail.com' },
      select: { email: true },
    });

    return 'GET USER QUERY - CALLED + ' + email.email;
  }
}
