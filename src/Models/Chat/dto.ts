import { IsString, IsMongoId } from "class-validator"

export class ChatDto {
  @IsMongoId()
  readonly user: string

  @IsMongoId()
  readonly roomId: string

  @IsString()
  readonly content: string
}

export class creatChatDto {
  @IsString()
  readonly content: string
}
