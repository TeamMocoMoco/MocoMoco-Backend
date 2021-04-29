import { IsString, IsMongoId, IsNumber, ArrayMaxSize, ArrayMinSize } from "class-validator"

class MarkerDto {
  @IsMongoId()
  readonly postId: string

  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  readonly location: number[]
}

export default MarkerDto
