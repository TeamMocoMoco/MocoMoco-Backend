import { IsString } from "class-validator";

class SMSDto {
    @IsString()
    readonly phone: string;
    @IsString()
    readonly generateRand: string;
}

export default SMSDto;
