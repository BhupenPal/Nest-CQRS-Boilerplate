import { IsMongoId } from 'class-validator';

export class GetUserProfileDto {
  @IsMongoId()
  id: string;
}
