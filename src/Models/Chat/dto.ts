import { IsString, IsMongoId } from "class-validator"

class ChatDto {
  @IsMongoId()
  readonly user: string

  @IsMongoId()
  readonly roomID: string

  @IsString()
  readonly content: string
}

export default ChatDto
