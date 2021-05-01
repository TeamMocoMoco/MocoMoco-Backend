import { IsMongoId } from "class-validator"

class RoomDto {
  @IsMongoId()
  readonly admin: string

  @IsMongoId()
  readonly postID: string

  @IsMongoId()
  readonly participant: string
}

export default RoomDto
