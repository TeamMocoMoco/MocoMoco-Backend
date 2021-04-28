import {
  IsString,
  IsDate,
  IsMongoId,
  IsInt,
  IsNumber,
  MinLength,
} from "class-validator";

class PostDto {
  @IsString()
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

  @MinLength(2, {
    each: true,
  })
  readonly hashtag: string[];

  @IsNumber({}, { each: true })
  readonly location: number[];

  @IsDate()
  readonly startDate: Date;

  @IsDate()
  readonly dueDate: Date;
}

export default PostDto;
