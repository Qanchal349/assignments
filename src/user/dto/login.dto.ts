import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    
    @IsNotEmpty()
    @ApiProperty()
    @IsEmail()
    @IsString()
    readonly email: string;
  
    
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    readonly password: string;
  }