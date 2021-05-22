import { IsMongoId } from "class-validator";

export class RoomDto {
  @IsMongoId()
  readonly admin: string;

  @IsMongoId()
  readonly post: string;

  @IsMongoId()
  readonly participant: string;
}

export class creatRoomDto {
  @IsMongoId()
  readonly post: string;

  @IsMongoId()
  readonly admin: string;
}
