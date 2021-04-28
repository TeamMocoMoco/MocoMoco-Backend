import { IsString, IsDate, IsMongoId, IsInt, IsArray } from "class-validator";

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
  @IsArray()
  readonly hashtag: [string];
  @IsArray()
  readonly location: [number];
  @IsDate()
  readonly startDate: Date;
  @IsDate()
  readonly dueDate: Date;
}

export default PostDto;
