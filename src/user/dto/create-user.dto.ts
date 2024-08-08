import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto{
     
    @IsNotEmpty()
    @IsString()
    @MinLength(4, { message: 'Username must be at least 4 characters long' })
    @MaxLength(20, { message: 'Username must not exceed 20 characters' })
    readonly username:string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    readonly email:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    readonly password:string;

}