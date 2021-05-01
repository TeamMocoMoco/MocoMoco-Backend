import { IsMongoId } from "class-validator";

class RoomDto {
  @IsMongoId()
  readonly admin: string;

  @IsMongoId()
  readonly postId: string;

  @IsMongoId()
  readonly participant: string;
}

export default RoomDto;
