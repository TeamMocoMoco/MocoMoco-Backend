import { IsString } from "class-validator";

class UserDto {
  @IsString()
  readonly id: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly nickname: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly phone: string;
}

export default UserDto;
