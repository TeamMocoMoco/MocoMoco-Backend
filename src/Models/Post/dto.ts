import {
  IsString,
  IsInt,
  IsNumber,
  IsDateString,
  ArrayMaxSize,
  ArrayMinSize,
  IsMongoId,
} from "class-validator";

export class PostDto {
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
  readonly location: number[];

  @IsString()
  readonly address: string;

  @IsString()
  readonly address_name: string;

  @IsDateString()
  readonly startDate: Date;

  @IsDateString()
  readonly dueDate: Date;
}

export class ParticipantDto {
  @IsMongoId()
  readonly participantId: string;
}
