import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrimaryDB } from '@app/database';
import { GetUserProfileQuery } from '../impl/get-user-profile.query';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler
  implements IQueryHandler<GetUserProfileQuery>
{
  constructor(private readonly prisma: PrimaryDB) {}

  async execute(query: GetUserProfileQuery): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.userId },
      select: {
        id: true,
        givenName: true,
        familyName: true,
        userName: true,
      },
    });

    return user;
  }
}
