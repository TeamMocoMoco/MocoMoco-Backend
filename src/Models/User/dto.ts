import { IsString } from "class-validator";

class UserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly role: string;
}

export default UserDto;
