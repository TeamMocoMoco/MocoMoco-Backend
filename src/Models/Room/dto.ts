import { IsMongoId } from "class-validator"

export class RoomDto {
  @IsMongoId()
  readonly admin: string

  @IsMongoId()
  readonly postId: string

  @IsMongoId()
  readonly participant: string
}

export class creatRoomDto {
  @IsMongoId()
  readonly postId: string

  @IsMongoId()
  readonly admin: string
}
