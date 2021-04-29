import { IsString } from "class-validator";

class UserDto {
  @IsString()
  readonly name: string;
}

export default UserDto;
