import {
  IsString,
  IsMongoId,
  IsInt,
  IsNumber,
  IsDateString,
  ArrayMaxSize,
  ArrayMinSize,
} from "class-validator";

class PostDto {
  @IsMongoId()
  readonly user: string;

  @IsString()
  readonly position: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsInt()
  readonly personnel: number;

  @IsString()
  readonly meeting: string;

  @IsString()
  readonly category: string;

  @IsString({ each: true })
  readonly hashtag: string[];

  @IsNumber({}, { each: true })
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  readonly location: number[];

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly dueDate: Date;
}

export default PostDto;